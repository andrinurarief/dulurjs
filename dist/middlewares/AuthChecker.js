"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesChecker = exports.AuthChecker = void 0;
const lodash_1 = __importDefault(require("lodash"));
function AuthChecker(options) {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        else {
            res.redirect(options.loginURL);
        }
    };
}
exports.AuthChecker = AuthChecker;
function RolesChecker(options, roles, schema) {
    return function (req, res, next) {
        if (req.isUnauthenticated()) {
            res.status(401).send();
        }
        else {
            if (lodash_1.default.intersection(req.user.roles, roles).length > 0) {
                if (schema == 'allowed')
                    return next();
                else
                    res.status(403).send();
            }
            else {
                res.status(403).send();
            }
        }
    };
}
exports.RolesChecker = RolesChecker;
