/**
 *
 * Example of how to send a product search event to the NextRoll server side
 * tracking API.
 *
 */
const NextRollAPI = require('./api');


/** Standard required parameters for all requests. */
const adroll_adv_id = 'ADV';
const adroll_pix_id = 'PIX';
const adroll_token = 'token12345';
// "True" indicates the call is for testing only and should not appear in metrics.
const dry_run = true;

// Example service for making API calls.
const nrapi = new NextRollAPI(
    adroll_adv_id,
    adroll_pix_id,
    adroll_token,
    dry_run
);
// Sets the event tracking parameters.
nrapi.set({
    event_name: 'productSearch',
    currency: 'USD',
    event_attributes: {
        keywords: 'shoes',
        products: [
            { product_id: 'sneaker-1234', price: '43.21' },
            { product_id: 'loafer-5678', price: '54.32' },
            { product_id: 'boot-9012', price: '65.43' },
        ]
    },
    identifiers: {
        email: 'shopper@domain.com',
        first_party_cookie: 'eeed2f3b7cd3fe9114909898a3cb8928-a_1730238462',
    },
    ip: '123.45.6.78',
    page_location: "https://www.website.com/search?q=shoes",
    user_agent: "Mozilla/5.0 Engine/20240101 Browser/123.0"
});
// Sends the event to the API. Results are returned via a Promise callback.
nrapi.send()
    .then(success_response => console.log(success_response))
    .catch(error_response => console.error(error_response));

