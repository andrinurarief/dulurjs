"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerService = void 0;
const glob_1 = require("glob");
const path_1 = require("path");
const fs_1 = require("fs");
require("reflect-metadata");
const lodash_1 = __importDefault(require("lodash"));
function registerService(app) {
    app.logger.debug('Register application service.');
    app.request.services = {};
    const serviceConfig = app.config.service;
    if (!serviceConfig) {
        app.logger.warn('Service configuration not defined.');
        return;
    }
    const files = glob_1.glob.sync(serviceConfig.path);
    files.forEach(file => {
        let serviceFilename = file;
        if (!fs_1.existsSync(serviceFilename))
            serviceFilename = path_1.join(process.cwd(), file);
        app.logger.debug(`Reading classes in file ${serviceFilename}`);
        const serviceClasses = require(serviceFilename);
        for (const className in serviceClasses) {
            const service = serviceClasses[className];
            const serviceName = Reflect.getOwnMetadata('service', service);
            // check if class is service or not
            if (!serviceName)
                return;
            // check if service already exists or not
            if (lodash_1.default.has(app.request.services, serviceName)) {
                app.logger.debug('Service will be ignored, service already exists.');
                app.logger.debug('Consider to using different name.');
                return;
            }
            const serviceHandler = new service(serviceConfig[serviceName]);
            app.request.services[serviceName] = serviceHandler;
            app.logger.debug(`Service ${serviceName} registered.`);
        }
    });
    app.logger.debug('Done registered all application service');
}
exports.registerService = registerService;
