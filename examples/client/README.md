Client Side Example Code
========================

id.js
-----
Reference code for retrieving user identifiers.

### `nextroll_first_party_cookie`
Returns the value of an existing NextRoll first party cookie set in your
website's domain. If no existing cookie is found, a new one is created
and returned.

If your site uses multiple subdomains, (e.g. www.website.com, api.website.com,
mobile.website.com) pass your website's effective top level domain.
For example: `nextroll_first_party_cookie("website.com")`


### `nextroll_adct`
Returns the most recent NextRoll click ID that was set if the current user
clicked on a previously viewed ad.

