import {Express} from 'express-serve-static-core';
import {RequestHandler} from 'express';
import log4js, {Logger} from 'log4js';
import path from 'path';
import * as fs from 'fs';

const express = require('express');

export type ApplicationOptions = {
    configDir: string, //default to configs folder in working directory
    configName: string, //default to app.js
}

export class Application {

    private app: Express = express();
    private logger: Logger = log4js.getLogger('core');
    private log: Logger;

    constructor(options: ApplicationOptions) {

        // config file
        if(!fs.existsSync(path.join(options.configDir, options.configName))) {
            this.logger.fatal(`Configuration doesn't exists!`);
            process.exit(1);
        }
        this.app.config = require(path.join(options.configDir, options.configName))

        // core logger
        this.app.logger = this.logger;

        // application logger
        this.app.request.logger = log4js.getLogger('app-name');
    }

    public use(handler: RequestHandler): Application {
        this.app.use(handler);
        return this;
    }

    protected getInstance() {
        return this.app;
    }

    // mount sub application, like auth dashboard, api dashboard, etc
    public mount(path: string, app: Application) {
        this.app.use(path, this.getInstance());
    }


}