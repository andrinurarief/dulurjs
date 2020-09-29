import { Express } from 'express-serve-static-core';
import { glob } from 'glob';
import { join } from 'path';
import { existsSync } from 'fs';
import 'reflect-metadata';
import _ from 'lodash';

export function registerService(app: Express) {

    app.logger.debug('Register application service.');

    app.request.services = {};
    const serviceConfig = app.config.service;

    if(!serviceConfig) {
        app.logger.warn('Service configuration not defined.');
        return;
    }

    const files: string[] = glob.sync(serviceConfig.path);

    files.forEach(file => {

        let serviceFilename = file;

        if(!existsSync(serviceFilename))
            serviceFilename = join(process.cwd(), file);

        app.logger.debug(`Reading classes in file ${serviceFilename}`);

        const serviceClasses = require(serviceFilename);
        for(const className in serviceClasses) {

            const service = serviceClasses[className];
            const serviceName: string = Reflect.getOwnMetadata('service', service);

            // check if class is service or not
            if(!serviceName) return;

            // check if service already exists or not
            if(_.has(app.request.services, serviceName)) {
                app.logger.debug('Service will be ignored, service already exists.');
                app.logger.debug('Consider to using different name.');
                return
            }

            const serviceHandler = new service(serviceConfig[serviceName]);
            app.request.services[serviceName] = serviceHandler;

            app.logger.debug(`Service ${serviceName} registered.`);
        }
    });

    app.logger.debug('Done registered all application service');
}