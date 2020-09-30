"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
function Service(serviceName) {
    return function (target, descriptor) {
        Reflect.defineMetadata('http:service', serviceName, target);
        return descriptor;
    };
}
exports.Service = Service;
