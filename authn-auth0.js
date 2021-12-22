/* globals AUTH0_DOMAIN AUTH0_CLIENT_ID AUTH0_REDIRECT_URI createAuth0Client IDP_TOKEN_COOKIE_NAME Cookies */

if (Cookies.get(IDP_TOKEN_COOKIE_NAME)) {
  document.write("You are authenticated, Welcome!");
} else {
  createAuth0Client({
    domain: AUTH0_DOMAIN,
    client_id: AUTH0_CLIENT_ID,
    redirect_uri: AUTH0_REDIRECT_URI
  }).then(auth0 => {
    window.addEventListener("load", async () => {
      const redirectResult = await auth0.handleRedirectCallback();
      
      try {
        const accessToken = await auth0.getTokenSilently({
          audience: "https://the-usher-instance-0001"
        });
        Cookies.set(IDP_TOKEN_COOKIE_NAME, accessToken);
        location.reload();
      } catch (err) {
        alert(
          "Couldn't get access token from IdP (Auth0). " +          
            err.error_description
        );
      }
    });

    var url = new URL(window.location);
    var code = url.searchParams.get("code");
    if (!code) {
      auth0.loginWithRedirect().catch(() => {
        alert("Error: Was unable to login/redirect to Auth0.");
      });
    }
  });
}

function idpLogout() {
  Cookies.remove(IDP_TOKEN_COOKIE_NAME);
  createAuth0Client({
    domain: AUTH0_DOMAIN,
    client_id: AUTH0_CLIENT_ID,
    redirect_uri: AUTH0_REDIRECT_URI
  }).then(auth0 => {
    auth0.logout();
  });
}
