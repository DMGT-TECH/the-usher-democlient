/* globals IDP_ACCESS_TOKEN THEUSHER_CLIENT_ID IDP_TOKEN_COOKIE_NAME THEUSHER_URL Cookies THEUSHER_TOKEN_COOKIE_NAME jwt_decode */

async function getTheUsherToken() {
  const IDP_TOKEN = Cookies.get(IDP_TOKEN_COOKIE_NAME);
  const HEADERS = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + IDP_TOKEN,
    client_id: THEUSHER_CLIENT_ID // e.g., test-client1
  };

  try {
    const RESPONSE = await fetch(THEUSHER_URL + (THEUSHER_URL.endsWith("/")?"":"/")  + "self/token", {
      method: "POST",
      headers: HEADERS
    });
    const THEUSHER_ACCESS_TOKEN = (await RESPONSE.json())["access_token"];
    const DECODED = jwt_decode(THEUSHER_ACCESS_TOKEN);
    Cookies.set(THEUSHER_TOKEN_COOKIE_NAME, THEUSHER_ACCESS_TOKEN);

    document.getElementById("messages").innerHTML +=
      "TheUsher issued you an <a href='https://jwt.io/#debugger-io?token=" +
      THEUSHER_ACCESS_TOKEN +
      "' target=_new>access token</a> (opens in new window).<P>";
    document.getElementById("messages").innerHTML +=
      "Scope: <tt>" + DECODED["scope"] + "</tt><P>";
  } catch (err) {
    alert("Error while attempting to get your access token from TheUsher. Please check its configuration. " + err)
  }


}

function theusherDeauthorize() {
  Cookies.remove(THEUSHER_TOKEN_COOKIE_NAME);
}


