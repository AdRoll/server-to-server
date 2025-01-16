/**
 * Gets the NextRoll first party cookie and refreshes it in browser.
 *
 * @param  {String} domain Optional domain to use in set/refresh cookie.
 * @return {String} Cookie value.
 */
function nextroll_first_party_cookie(domain) {
    var fpc = String(window.document.cookie || '').match(/__adroll_fpc=([^;]+)/),
        cookie = '',
        exp = new Date();
    // Cookie expiration is 1 year from now.
    exp.setTime(exp.getTime() + (86400 * 365 * 1000));

    // Generate a new first party cookie if one doesn't already exist.
    if (!fpc || fpc.length < 2 || fpc[1].length < 32) {
        var blocks, i;
        // Prefer Crypto for random numbers otherwise fallback to Math.random.
        if (window.crypto && window.Uint32Array) {
            blocks = new window.Uint32Array(4);
            window.crypto.getRandomValues(blocks);
        } else {
            for (i = 0; i < 4; i++) {
                blocks[i] = Math.floor(Math.random() * 0xffffffff);
            }
        }
        for (i = 0; i < blocks.length; i++) {
            cookie += String(blocks[i].toString(16) + '00000000').substr(0, 8);
        }
        // Include cookie generation date suffix.
        cookie += '-' + (new Date()).getTime();
    } else {
        cookie = fpc[1];
    }
    if (domain) {
        domain = '; domain=' + domain;
    } else {
        domain = '';
    }
    // Refreshes the cookie expiration in the browser.
    window.document.cookie = '__adroll_fpc=' + cookie + domain
        + '; path=/; samesite=lax; expire=' + exp.toGMTString();
    return cookie;
}

/**
 * Returns the NextRoll adct URL param (if present).
 *
 * @return {String|null} ADCT param.
 */
function nextroll_adct() {
    var param = String(window.location.search || '').match(/[\?\&]adct=([^\&]+)/);
    if (param && param.length > 1) {
        window.localStorage.setItem('adroll_adct', param[1]);
        return param[1];
    }
    return window.localStorage.getItem('adroll_adct') || null;
}
