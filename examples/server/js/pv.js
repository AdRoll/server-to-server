/**
 *
 * Example of how to send a pageview event to the NextRoll server side
 * tracking API.
 *
 */
const NextRollAPI = require('./api');


// "true" indicates the call is for testing only and should not appear
// in metrics. Be sure to replace with "false" for actual production use.
const dry_run = true;

// Example service for making API calls.
const nrapi = new NextRollAPI(dry_run);

// Sets the event tracking parameters.
nrapi.set({
    event_name: 'pageView',
    currency: 'USD',
    event_attributes: {
        total: '678.90',
        products: [
            {
                product_id: 'television-1234',
                price: '678.90',
                product_group: 'electronics',
                category: 'best-seller'
            }
        ]
    },
    identifiers: {
        email: 'user@domain.com',
        first_party_cookie: '75733db5240f8675887af7b2de366926-a_1727130317'
    },
    ip: '123.45.67.89',
    page_location: 'https://www.website.com/electronics/television-1234',
    user_agent: 'Mozilla/5.0 Engine/20240101 Browser/123.0',
});

// Sends the event to the API. Results are returned via a Promise callback.
nrapi.send()
    .then(success_response => console.log(success_response))
    .catch(error_response => console.error(error_response));
