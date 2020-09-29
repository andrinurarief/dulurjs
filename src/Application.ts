import { Express } from 'express-serve-static-core';
import {RequestHandler} from "express";
import log4js, { Logger } from 'log4js';
const express = require('express');

export class Application {

    private app: Express = express();
    private logger: Logger = log4js.getLogger('core');

    constructor() {
        this.app.logger = this.logger;
    }

    public use(handler: RequestHandler) : Application {
        this.app.use(handler);
        return this;
    }

}