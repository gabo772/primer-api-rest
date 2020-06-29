"use strict";
var basicAuth = require("basic-auth");
let credentials = require("./app_config").auth;

module.exports = function () {
    return function (req, res, next) {
        if (!credentials.enabled) {
            return next();
        }

        var user = basicAuth(req);
        if (
            !user ||
            user.name !== credentials.user ||
            user.pass !== credentials.password
        ) {
            res.set("WWW-Authenticate", "Basic realm=Authorization Required");
            return res.send(401);
        }
        next();
    };
};
