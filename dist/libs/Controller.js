"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerController = void 0;
const glob_1 = require("glob");
const fs_1 = require("fs");
const path_1 = require("path");
const HttpMethodDecorator_1 = require("../decorators/HttpMethodDecorator");
const AuthenticationDecorator_1 = require("../decorators/AuthenticationDecorator");
const AuthChecker_1 = require("../middlewares/AuthChecker");
const lodash_1 = __importDefault(require("lodash"));
const { Router } = require('express');
function registerController(app) {
    app.logger.debug('Register application controller.');
    app.endpoints = [];
    const controllerConfig = app.config.controller;
    if (!controllerConfig) {
        app.logger.warn('Controller configuration not defined.');
        return;
    }
    const authOptions = {
        loginURL: '/login'
    };
    const files = glob_1.glob.sync(controllerConfig.path);
    files.forEach(file => {
        let controllerFilename = file;
        if (!fs_1.existsSync(controllerFilename))
            controllerFilename = path_1.join(process.cwd(), file);
        const controllerClasses = require(controllerFilename);
        for (const className in controllerClasses) {
            const controller = controllerClasses[className];
            const middlewares = [];
            const router = Router();
            const controllerHandler = new controller();
            const route = Reflect.getOwnMetadata('route', controller) ?? '/';
            const authorized = Reflect.getOwnMetadata('authorize', controller) ?? false;
            const anonymous = Reflect.getOwnMetadata('authorize', controller) ?? false;
            const metadata = Reflect.getMetadata(HttpMethodDecorator_1.ROUTE_METADATA, controller.prototype);
            const rolesMetadata = Reflect.getMetadata(AuthenticationDecorator_1.HTTP_ROLES, controller.prototype);
            // define class middlewares
            if (middlewares.length > 0)
                router.use(middlewares);
            if (metadata && metadata.length > 0) {
                metadata.forEach(m => {
                    const methodMiddlewares = [];
                    if (!anonymous && authorized) {
                        methodMiddlewares.push(AuthChecker_1.AuthChecker(authOptions));
                    }
                    //check roles metadata
                    if (rolesMetadata && rolesMetadata.length > 0) {
                        const result = lodash_1.default.find(rolesMetadata, r => r.methodName == m.methodName);
                        if (result) {
                            methodMiddlewares.push(AuthChecker_1.RolesChecker(authOptions, result.roles, result.schema));
                        }
                    }
                    router[m.method](m.path, methodMiddlewares, (req, res, next) => {
                        if (controllerHandler instanceof Promise) {
                            controllerHandler.catch(next);
                        }
                        const handler = controllerHandler[m.methodName];
                        if (handler instanceof Promise) {
                            handler.catch(next);
                        }
                        // Add information to endpoints.
                        app.endpoints.push({
                            path: m.path,
                            httpMethod: m.method,
                            method: m.method,
                            controller: className
                        });
                        handler(req, res, next);
                        // TODO Add Dependency Injection
                    });
                });
            }
            app.use(route.path, router);
        }
    });
}
exports.registerController = registerController;
