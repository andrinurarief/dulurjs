"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpDelete = exports.HttpPut = exports.HttpPost = exports.HttpGet = exports.Route = exports.HttpMethod = exports.ROUTE_METADATA = void 0;
require("reflect-metadata");
exports.ROUTE_METADATA = 'route:metadata';
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "get";
    HttpMethod["POST"] = "post";
    HttpMethod["PUT"] = "put";
    HttpMethod["DELETE"] = "delete";
})(HttpMethod = exports.HttpMethod || (exports.HttpMethod = {}));
function Route(path) {
    return function (target, descriptor) {
        Reflect.defineMetadata('route', {
            path: path
        }, target);
        return descriptor;
    };
}
exports.Route = Route;
function HttpHelper(path, method) {
    if (!path)
        path = '';
    return function (target, methodName, descriptor) {
        if (!Reflect.hasOwnMetadata(exports.ROUTE_METADATA, target)) {
            Reflect.defineMetadata(exports.ROUTE_METADATA, [], target);
        }
        const metadata = Reflect.getOwnMetadata(exports.ROUTE_METADATA, target);
        const paramTypes = Reflect.getMetadata('design:paramtypes', target, methodName);
        metadata.push({
            method,
            path,
            methodName,
            paramTypes
        });
    };
}
exports.HttpGet = (path) => HttpHelper(path, HttpMethod.GET);
exports.HttpPost = (path) => HttpHelper(path, HttpMethod.POST);
exports.HttpPut = (path) => HttpHelper(path, HttpMethod.PUT);
exports.HttpDelete = (path) => HttpHelper(path, HttpMethod.DELETE);
