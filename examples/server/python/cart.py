"""

 Example of how to send an "add to cart" event to the NextRoll server side
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
    'event_name': 'addToCart',
    'currency': 'USD',
    'event_attributes': {
        'products': [
            { 'product_id': 'shoes-1234', 'quantity': 1, 'price': '56.78' }
        ],
    },
})

# Sends the event to the API.
try:
    result = nrapi.send()
    print(result)
except NextRollAPIException as e:
    print(['ERROR', e.args, e.code, e.body], file=sys.stderr)

