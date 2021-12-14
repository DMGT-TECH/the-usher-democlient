Welcome to a Client Web Application
=================

This is a secured web application that allows a user to authenticate themselves and get authorization to (and access) an arithmetic server API.  It demonstrates a simple scenario where TheUsher is used for authorization (see diagram below).

**User flow**: When you use this application you are first redirected to authenticate with credentials via an Auth0 tenant.  You then return to the application and can click a button to obtain authorization from TheUsher.  With this authorization in hand you can use the UI to perform arithmetic operations for which you are authorized.

## Usage (local, manually)

Note: When running everything locally, we cannot use the full redirect flow (yet) that we'd get because the mock identity server does not currently have a login page.  If you'd like the flow with redirects, etc, configure Auth0 as an identity provider and make sure CORS and localhost are set up (see the Auth0 section below).

The following instructions show how to obtain the tokens manually and use them in the client.

1. Check out `the-usher-server`. Launch the developer configuration with `cd the-usher-server; docker-compose up`.
1. Check out `the-usher-democlient`. Serve it locally with `cd the-usher-democlient; python3 -m http.server`.
1. Check out `the-usher-demoresource`, Launch it locally with `cd the-usher-demoresource; PORT=9000 npm start`.
1. Get an IDP token from the mock identity server

```
export IDP_TOKEN=`./the-usher-server/server/scripts/get_idp_token_from_mockserver.sh | jq --raw-output .access_token`
```

5. Get an access token from The Usher

```
export THE_USHER_TOKEN=`curl -X POST "http://localhost:3001/self/token" -H "Content-type: application/json" -H "Authorization: Bearer $IDP_TOKEN"  -H "client_id: test-client1" | jq --raw-output .access_token`
```

6. Echo the tokens and set them in the client app at http://localhost:8000/developer-cookies.html
7. Open the client application at http://localhost:8000/


## Creating your own Instance(s)

You could optionally do any or all of the following:

1. Deploy and host the client app on your local machine or elsewhere (if locally, make sure localhost is allowed on the Auth0 tenant you are using and CORS has http://localhost:8000 in it)
2. Configure and use your own Auth0 tenant (make sure to point this client application to it, make sure your TheUsher instance is seeded with an authenticated user from your Auth0 tenant)
3. Deploy your own TheUsher instance (ensure it contains a permissioned user from our DMGT-Test Auth0 tenant or your tenant)
4. Deploy your own backend arithmetic server (make sure to point this client application to it).


## Configuring your own Auth0 Tenant

You can use this application with Auth0 as an identity provider, even if running and developing locally.

1. Set up a client Auth0 Application, e.g., called something like *TheUsher Client Application* with the following parameters:

* Settings
  * Native Application
  * Callbacks: https://my-theusher-client.glitch.me/ (or wherever you are hosting the app; could be `http://localhost:8000`)
  * Web Origins: https://my-theusher-client.glitch.me ( """ )
  * CORS: https://my-theusher-client.glitch.me ( """ ; **NOTE: just the host domain, no URL paths**.)
* Connections: Username-Password-Authentication / Database On.

2.  Create an Auth0 "API" to represent that you will be calling The Usher. The Identifier will be the Audience the client app will use when requesting an access token from Auth0.

* Name: "TheUsher Server for Glitch Web App"
* Identifier: "https://the-usher-instance-0001"
* Signing Algorithm: "RS256"

3. Under Users and Roles click +CREATE USER and create a user with Username-Password-Authentication (this is where you might create test-user1@dmgtoocto.com).

## Configuring your own TheUsher instance and database

* You'll need to set up your TheUsher instance with roles and permissions for the Auth0 user (identified by the sub-claim in their IdP access token; looks like auth0|nnnnnnnn).

