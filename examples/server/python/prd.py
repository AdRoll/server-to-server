"""

 Example of how to send a product search event to the NextRoll server side
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
    'event_name': 'productSearch',
    'currency': 'USD',
    'event_attributes': {
        'keywords': 'shoes',
        'products': [
            { 'product_id': 'sneaker-1234', 'price': '43.21' },
            { 'product_id': 'loafer-5678', 'price': '54.32' },
            { 'product_id': 'boot-9012', 'price': '65.43' },
        ]
    },
    'identifiers': {
        'email': 'shopper@domain.com',
    },
})

# Sends the event to the API.
try:
    result = nrapi.send()
    print(result)
except NextRollAPIException as e:
    print(['ERROR', e.args, e.code, e.body], file=sys.stderr)

