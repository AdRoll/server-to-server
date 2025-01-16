"""

Example server code implementation that calls NextRoll server-side tracking API.

Assumes Flask as web framework (see NextRollAPI.props_from_flask) but could be
modified to support alternate frameworks (e.g. Pylons, Django, etc).

"""
import flask.request
from flask import g
import json
import os
import urllib.request


# Be sure to update parameters with the values assigned to your account.
ADV_ID = '<REPLACE_ME_NEXTROLL_ADV_ID>'
PIX_ID = '<REPLACE_ME_NEXTROLL_PIX_ID>'
TOKEN = '<REPLACE_ME_NEXTROLL_TOKEN>'


class NextRollAPIException(Exception):
    code = None

    def __init__(self, body, code, **kwargs):
        super(NextRollAPIException, self).__init__(json.dumps(body), **kwargs)
        self.body = body
        self.code = code


class NextRollAPI:
    NEXTROLL_BASE_URL = 'https://srv.adroll.com/api'

    def __init__(self, dry_run=False):
        """
        Required params for all API requests.

        :param dry_run: True = request is for testing only and should not
                        be collected in official metrics.
        """
        self.adv_id = ADV_ID
        self.pix_id = PIX_ID
        self.token = TOKEN
        self.dry_run = dry_run
        self.reset()

    def get_first_party_cookie(self):
        """
        Retrieves the NextRoll first party cookie from the current flask request.

        :return str: The first party cookie.
        """
        if 'adroll_fpc' not in g:
            fpc = flask.request.cookies.get('__adroll')
            if fpc is None:
                fpc = os.urandom(32).hex()[:32]
            g.adroll_fpc = fpc

        return g.adroll_fpc

    def add_cookie_to_response(self, resp):
        """
        Refreshes the NextRoll first party cookie in the given flask response.

        :param resp: The response from flask.make_response().
        :return resp: The updated flask response.
        """
        fpc = self.get_first_party_cookie()
        max_age = 86400 * 365
        resp.set_cookie(
            '__adroll_fpc',
            value=fpc,
            max_age=max_age,
            path='/',
            samesite='lax')
        return resp

    def props_from_flask(self):
        """
        Reads important props from the current flask request.

        :return dict: Props to be used in API call.
        """
        # May be load balancer IP
        ip = flask.request.headers.get('X-Forwarded-For')
        if ip is not None:
            ip = ip.split(',')[0]
        else:
            ip = flask.request.remote_addr
        return {
            'ip': ip,
            'user_agent': flask.request.headers.get('User-Agent'),
            'page_location': flask.request.url,
            'adct': flask.request.args.get('adct'),
            'first_party_cookie': self.get_first_party_cookie()
        }

    def reset(self):
        req_props = self.props_from_flask()

        self.props = {
            'advertisable_eid': self.adv_id,
            'pixel_eid': self.pix_id,
            'event_name': None,
            'event_attributes': None,
            'external_data': None,
            'ip': req_props['ip'],
            'user_agent': req_props['user_agent'],
            'conversion_value': None,
            'currency': None,
            'page_location': req_props['page_location'],
            'device_os': None,
            'device_type': None,
            'package_app_name': None,
            'package_app_version': None,
            'timestamp': None,
            'identifiers': {
                'adct': req_props['adct'],
                'email': None,
                'device_id': None,
                'first_party_cookie': req_props['first_party_cookie'],
                'user_id': None,
            }
        }

    def set(self, props, dest=None):
        """
        Set the properties for the API call (see reset for model).

        Repeated calls will merge dictionaries while overwriting scalars.

        :param props: Dict of properties to set.
        :param dest:  Used internally for deep merge recursion.
        :return NextRollAPI: Class instance for chaining.
        """
        if dest is None:
            dest = self.props
        for k in props:
            if type(props[k]) == dict:
                if k not in dest or type(dest[k]) != dict:
                    dest[k] = {}
                self.set(props[k], dest[k])
            else:
                dest[k] = props[k]
        return self

    def filter(self, src):
        dest = {}
        for k in src:
            if src[k] is not None:
                if type(src[k]) == dict:
                    dest[k] = self.filter(src[k])
                    if len(dest[k]) == 0:
                        del dest[k]
                else:
                    dest[k] = src[k]
        return dest

    def send(self):
        """
        Transmits the data to the NextRoll server-side tracking endpoint.

        :return
        """
        self.props['advertisable_eid'] = self.adv_id
        self.props['pixel_eid'] = self.pix_id
        self.props['dry_run'] = self.dry_run

        url = '{}?advertisable={}&dry_run={}'.format(
            self.NEXTROLL_BASE_URL,
            self.adv_id,
            int(self.dry_run))
        headers = {
            'Content-Type': 'application/json',
            'Authorization': 'token {}'.format(self.token)
        }

        data = self.filter(self.props)
        req = urllib.request.Request(url, json.dumps(data).encode('utf-8'), headers)
        try:
            resp = urllib.request.urlopen(req)
            code = resp.getcode()
            body = json.loads(resp.read().decode())
        except urllib.error.HTTPError as e:
            code = e.code
            body = json.loads(e.read().decode())

        if code == 200:
            return body
        raise NextRollAPIException(body, code)
