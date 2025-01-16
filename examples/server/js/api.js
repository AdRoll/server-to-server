/**
 *
 * Example service to support calling the NextRoll server side tracking API.
 *
 */
const https = require('node:https');
const { randomBytes } = require('node:crypto');

const API_BASE_URL = 'https://srv.adroll.com/api/';


// Be sure to update parameters with the values assigned to your account.
const ADV_ID = '<REPLACE_ME_NEXTROLL_ADV_ID>';
const PIX_ID = '<REPLACE_ME_NEXTROLL_PIX_ID>';
const TOKEN = '<REPLACE_ME_NEXTROLL_TOKEN>';


class NextRollAPI {
    /**
     * Required params for all API requests.
     *
     * @param {Boolean} dry_run True = request is for testing only and should
     *                          not be collected in official metrics.
     */
    constructor(dry_run = false) {
        this.adv_id = ADV_ID;
        this.pix_id = PIX_ID;
        this.token = TOKEN;
        this.dry_run = dry_run;
        this.reset();
    }

    /**
     * Generates a new NextRoll first-party-cookie.
     *
     * If the user does not already have a cookie named __adroll_fpc in your
     * domain, call this method to generate a new cookie. Then set it with
     * the following cookie parameters:
     *
     * __adroll_fpc=<COOKIE GOES HERE>; samesite=lax; max-age=31536000; path=/;
     *
     * @return {String} The cookie value to insert for <COOKIE GOES HERE>.
     */
    newcookie() {
        const buf = randomBytes(16);
        return `${buf.toString('hex')}-${(new Date()).getTime()}`;
    }

    reset() {
        this.props = {
            conversion_value: undefined,
            currency: undefined,
            device_os: undefined,
            device_type: undefined,
            event_name: undefined,
            event_attributes: {
                order_id: undefined,
                user_id: undefined,
            },
            identifiers: {
                email: undefined,
                device_id: undefined,
                first_party_cookie: undefined,
                user_id: undefined,
            },
            ip: undefined,
            keyword: undefined,
            package_app_name: undefined,
            package_app_version: undefined,
            page_location: undefined,
            timestamp: (new Date()).getTime() / 1000,
            user_agent: undefined,
        };
    }

    /**
     * Sets the properties for the API call (see reset for model).
     *
     * Repeated calls will merge objects while overwriting scalars.
     *
     * @param {Object} props Properties to set.
     * @param {Object} dest  Used internally for recursion.
     *
     * @return {NextRollAPI} Class instance for chaining.
     */
    set(props, dest) {
        if (typeof dest === 'undefined') {
            dest = this.props;
        }
        for (const k in props) {
            if (!props.hasOwnProperty(k)) {
                continue;
            }
            if (typeof props[k] === 'object') {
                if (typeof dest[k] !== 'object') {
                    dest[k] = Array.isArray(props[k]) ? [] : {};
                }
                this.set(props[k], dest[k]);
            } else {
                dest[k] = props[k];
            }
        }
        return this;
    }

    filter(src) {
        const dest = Array.isArray(src) ? [] : {};
        for (const k in src) {
            if (!src.hasOwnProperty(k) || typeof src[k] === 'undefined') {
                continue;
            }
            if (typeof src[k] === 'object') {
                dest[k] = this.filter(src[k]);
                if (Object.keys(dest[k]).length === 0) {
                    delete dest[k];
                }
            } else {
                dest[k] = src[k];
            }
        }
        return dest;
    }

    /**
     * Transmits the data to the NextRoll server-side tracking endpoint.
     *
     * @return {Promise} Promise object for handling response or errors.
     */
    send() {
        return new Promise((resolve, reject) => {
            this.props.advertisable_eid = this.adv_id;
            this.props.pixel_eid = this.pix_id;
            this.props.dry_run = this.dry_run;

            const url = API_BASE_URL
                + `?advertisable=${this.adv_id}`
                + `&dry_run=${Number(this.dry_run)}`;
            const body = JSON.stringify(this.filter(this.props));
            const options = {
                method: 'POST',
                headers: {
                    Authorization: `token ${this.token}`,
                    'Content-Type': 'application/json',
                    'Content-Length': body.length
                }
            };

            const req = https.request(url, options, res => {
                let result = '';
                res.on('data', chunk => {
                    result = result + chunk;
                });
                res.on('end', () => {
                    if (res.statusCode !== 200) {
                        reject(result);
                    } else {
                        resolve(result);
                    }
                });
            });
            req.on('error', (e) => {
                reject(e);
            });

            req.write(body);
            req.end();
        });
    }
}

module.exports = NextRollAPI;
