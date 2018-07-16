function login(email, password, callback) {
    // This script should authenticate a user against the credentials stored in
    // your database.
    // It is executed when a user attempts to log in or immediately after signing
    /*
    Configuration values required to call this API are: 
    
    LDAP_API_URL = ur ldap api url
AUTH0_DOMAIN = tenant.auth0.com
mgmt_client_id	= client_id for server side client to call the LDAP API
auth0_api_audience	= audience defined in auth0 for LDAP API
auth0_api_scope	= Scope for the API
mgmt_client_secret	= client_secret for for server side client to call the LDAP API
    */
    
console.log(configuration);
  getToken(function(error, token) {
        if (error) callback(new Error(error));
        var request = require("request");

        var options = {
            method: 'POST',
            url: configuration.LDAP_API_URL,
            headers: {
                authorization: 'Bearer ' + token
            },
            body: {
                email: email,
                password: password
            },
            json: true
        };

        request(options, function(error, response, body) {
            if (error) {
                console.log(error);
                return callback(error);
            }
            if (response.statusCode !== 200) {
                console.log(body);
                return callback(error);
            } else 
            {
              console.log(body);
                var profile = {
                    user_id: body.email,
                    email: body.email

                };
                return callback(null, profile);
            }

        });


    });

    function getToken(cb) {

        if (global.accessToken === null) cb(null, global.accessToken);
        else {
            var request = require("request");

            var body = {"client_id": configuration.mgmt_client_id,
            "client_secret":configuration.mgmt_client_secret,
            "audience":configuration.auth0_api_audience,
            "grant_type":"client_credentials",
            "scope": configuration.auth0_api_scope
        };
            var options = {
                method: 'POST',
                url: 'https://' + configuration.AUTH0_DOMAIN + '/oauth/token',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(body)

            };

            request(options, function(error, response, body) {
                if (error){ 
                  console.log(error);
                  cb(new Error(error));
                }
                else {
                  console.log(body);
                    global.accessToken = JSON.parse(body).access_token;
                    cb(null, JSON.parse(body).access_token);
                }
            });

        }
    }

}
