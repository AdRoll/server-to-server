/**
 *
 * Example of how to send a conversion event to the NextRoll server side
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
    conversion_value: '123.45',
    currency: 'USD',
    event_name: 'purchase',
    event_attributes: {
        order_id: 'order-1234',
        user_id: 'user-5678',
    },
    identifiers: {
        email: 'customer@example.com',
        first_party_cookie: 'ebb883e7afb5d00573288f188cc75eaa-a_1730154992',
        user_id: 'user-5678',
    },
    ip: '12.34.56.89',
    package_app_name: 'com.website.store',
    package_app_version: '1.234.56r7',
    page_location: 'https://www.website.com/store/checkout',
    user_agent: 'Mozilla/5.0 Engine/20240101 Browser/123.0',
});

// Sends the event to the API. Results are returned via a Promise callback.
nrapi.send()
    .then(success_response => console.log(success_response))
    .catch(error_response => console.error(error_response));

