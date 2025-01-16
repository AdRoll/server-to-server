"""

 Example of how to send a conversion event to the NextRoll server side
 tracking API.

"""
from api import NextRollAPI, NextRollAPIException
import sys


# "True" indicates the call is for testing only and should not appear
# in metrics. Be sure to replace with "False" for actual production use.
dry_run = True

# Example service for making API calls.
nrapi = NextRollAPI(dry_run)

# Sets the event tracking parameters.
nrapi.set({
    'conversion_value': '123.45',
    'currency': 'USD',
    'event_name': 'purchase',
    'event_attributes': {
        'order_id': 'order-1234',
        'user_id': 'user-5678',
    },
    'identifiers': {
        'email': 'customer@example.com',
        'user_id': 'user-5678',
    },
    'package_app_name': 'com.website.store',
    'package_app_version': '1.234.56r7',
})

# Sends the event to the API.
try:
    result = nrapi.send()
    print(result)
except NextRollAPIException as e:
    print(['ERROR', e.args, e.code, e.body], file=sys.stderr)

