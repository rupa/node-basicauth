// http basic auth as simple as I could make it
//
// auth = require('./auth');
// auth.realm = 'private';
// auth.msg = '{"error": "401 Unauthorized"}';
// var creds = auth(req, res, function(user, pass) {
//     if( user == 'validuser' && pass == 'correctpassword' ) return true;
//     return false
// });
// if( ! creds ) return;

var base64 = require('base64');

var auth = {};

auth.content_type = 'application/json';

auth.realm = "private";

auth.msg = JSON.stringify({"error": "401 Unauthorized"});

auth.authorize = function(req, res, callback) {
    if( "authorization" in req.headers ) {
        var authorization = req.headers.authorization.split(' ');
        authorization = base64.decode(authorization[1]).split(':');
        var ok = callback(authorization[0], authorization[1]);
        if( ok ) return ok;
        //return callback(authorization[0], authorization[1]);
    }
    res.writeHead(401, {
        "WWW-Authenticate": 'Basic Realm="' + auth.realm + '"',
        "Content-Type": '"' + auth.content_type + '"',
    });
    res.write(auth.msg);
    res.end();
}

module.exports = auth;
