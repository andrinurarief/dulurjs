"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllowAnonymous = exports.Authorize = exports.Policies = exports.Policy = exports.Roles = exports.HTTP_ROLES = void 0;
require("reflect-metadata");
exports.HTTP_ROLES = 'http:roles';
function Roles(roles, schema = 'allowed') {
    return function (target, methodName, descriptor) {
        if (!Reflect.hasOwnMetadata(exports.HTTP_ROLES, target)) {
            Reflect.defineMetadata(exports.HTTP_ROLES, [], target);
        }
        const metadata = Reflect.getOwnMetadata(exports.HTTP_ROLES, target);
        metadata.push({
            roles,
            methodName,
            schema
        });
        return descriptor;
    };
}
exports.Roles = Roles;
function Policy() {
    return function (target, descriptor) {
    };
}
exports.Policy = Policy;
function Policies() {
    return function (target, descriptor) {
    };
}
exports.Policies = Policies;
function Authorize() {
    return function (target, descriptor) {
        Reflect.defineMetadata('authorize', true, target);
        return descriptor;
    };
}
exports.Authorize = Authorize;
function AllowAnonymous() {
    return function (target, descriptor) {
        Reflect.defineMetadata('anonymous', true, target);
        return descriptor;
    };
}
exports.AllowAnonymous = AllowAnonymous;
