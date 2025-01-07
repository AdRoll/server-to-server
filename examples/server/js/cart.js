/**
 *
 * Example of how to send an "add to cart" event to the NextRoll server side
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
    event_name: 'addToCart',
    currency: 'USD',
    event_attributes: {
        products: [
            { product_id: 'shoes-1234', quantity: 1, price: '56.78' }
        ],
    },
    identifiers: {
        first_party_cookie: '8d5c4612bd1017686d7778a3bb0b39c8-a_1730238675',
    },
    ip: '123.45.67.89',
    page_location: 'https://www.website.com/product/shoes-1234',
    user_agent: 'Mozilla/5.0 Engine/20240101 Browser/123.0',
});
// Sends the event to the API. Results are returned via a Promise callback.
nrapi.send()
    .then(success_response => console.log(success_response))
    .catch(error_response => console.error(error_response));
