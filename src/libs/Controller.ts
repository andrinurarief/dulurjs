import { Express, Request, Response } from 'express-serve-static-core';
import {glob} from 'glob';
import {existsSync} from 'fs';
import {join} from 'path';
import {IRouter, NextFunction, RequestHandler} from 'express';
import {ROUTE_METADATA, RouteMetadata} from '../decorators/HttpMethodDecorator';
import {HTTP_ROLES, RoleMetadata} from '../decorators/AuthenticationDecorator';
import {AuthChecker, AuthOptions, RolesChecker} from '../middlewares/AuthChecker';
import _ from 'lodash';

const { Router } = require('express');

export function registerController(app: Express) {

    app.logger.debug('Register application controller.');

    app.endpoints = [];

    const controllerConfig = app.config.controller;

    if(!controllerConfig) {
        app.logger.warn('Controller configuration not defined.');
        return;
    }

    const authOptions: AuthOptions = {
        loginURL: '/login'
    }

    const files: string[] = glob.sync(controllerConfig.path);

    files.forEach(file => {

        let controllerFilename = file;

        if(!existsSync(controllerFilename))
            controllerFilename = join(process.cwd(), file);

        const controllerClasses = require(controllerFilename);
        for(const className in controllerClasses) {

            const controller = controllerClasses[className];
            const middlewares: RequestHandler[] = [];

            const router: IRouter = Router();
            const controllerHandler = new controller();

            const route: any = Reflect.getOwnMetadata('route', controller) ?? '/';
            const authorized = Reflect.getOwnMetadata('authorize', controller) ?? false;
            const anonymous = Reflect.getOwnMetadata('authorize', controller) ?? false;
            const metadata: RouteMetadata[] = Reflect.getMetadata(ROUTE_METADATA, controller.prototype);
            const rolesMetadata: RoleMetadata[] = Reflect.getMetadata(HTTP_ROLES, controller.prototype);

            // define class middlewares
            if(middlewares.length > 0)
                router.use(middlewares);

            if(metadata && metadata.length > 0) {

                metadata.forEach(m => {

                    const methodMiddlewares: RequestHandler[] = [];

                    if(!anonymous && authorized) {
                        methodMiddlewares.push(AuthChecker(authOptions))
                    }

                    //check roles metadata
                    if(rolesMetadata && rolesMetadata.length > 0) {
                        const result = _.find(rolesMetadata, r => r.methodName == m.methodName);

                        if(result) {
                            methodMiddlewares.push(RolesChecker(authOptions, result.roles, result.schema));
                        }
                    }

                    router[m.method](m.path, methodMiddlewares, (req: Request, res: Response, next: NextFunction) => {
                        if(controllerHandler instanceof Promise) {
                            controllerHandler.catch(next);
                        }

                        const handler = controllerHandler[m.methodName];
                        if(handler instanceof Promise) {
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