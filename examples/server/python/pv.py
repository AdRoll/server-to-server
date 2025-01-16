"""

 Example of how to send a pageview event to the NextRoll server side
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
    'event_name': 'pageView',
    'currency': 'USD',
    'event_attributes': {
        'total': '678.90',
        'products': [
            {
                'product_id': 'television-1234',
                'price': '678.90',
                'product_group': 'electronics',
                'category': 'best-seller'
            }
        ]
    },
    'identifiers': {
        'email': 'user@domain.com',
    },
})

# Sends the event to the API.
try:
    result = nrapi.send()
    print(result)
except NextRollAPIException as e:
    print(['ERROR', e.args, e.code, e.body], file=sys.stderr)

