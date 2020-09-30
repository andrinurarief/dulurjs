"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const log4js_1 = __importDefault(require("log4js"));
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
const express = require('express');
class Application {
    constructor(options) {
        this.app = express();
        this.logger = log4js_1.default.getLogger('core');
        // config file
        if (!fs.existsSync(path_1.default.join(options.configDir, options.configName))) {
            this.logger.fatal(`Configuration doesn't exists!`);
            process.exit(1);
        }
        this.app.config = require(path_1.default.join(options.configDir, options.configName));
        // core logger
        this.app.logger = this.logger;
        // application logger
        this.app.request.logger = log4js_1.default.getLogger('app-name');
    }
    use(handler) {
        this.app.use(handler);
        return this;
    }
    getInstance() {
        return this.app;
    }
    // mount sub application, like auth dashboard, api dashboard, etc
    mount(path, app) {
        this.app.use(path, this.getInstance());
    }
}
exports.Application = Application;
