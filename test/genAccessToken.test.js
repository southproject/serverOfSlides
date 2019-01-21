//test Unit引包
var test = require('tape');
var request = require('superagent');
var baseUrl = 'http://localhost:3000/api';

var userCredentials = {
    username: "bing",
    password: "123456789"
};
var clientCredentials = {
    client_id: "A10",
    client_secret: "xiaomi"
};
var accessToken;
var refreshToken;

function getTokensFromBody(body) {
    if (!('access_token' in body) || !('refresh_token' in body)) {
        return false;
    }

    accessToken = body['access_token'];
    refreshToken = body['refresh_token'];

    return true;
}

test('Get token from username-password', function (t) {
    request
        .post(baseUrl + '/oauth/token')
        .send({ grant_type: 'password' })
        .send(userCredentials)
        .send(clientCredentials)
        .end(function (err, res) {
            t.equal(res.status, 200, 'response status shoud be 200');
            t.true(getTokensFromBody(res.body), 'tokens shoud be in response body');
            //console.log(res.body);
            t.end();
        });
       //console.log('userCredentials: ');
       //console.log(userCredentials);
       //console.log('clientCredentials: ')
       //console.log(clientCredentials);
});