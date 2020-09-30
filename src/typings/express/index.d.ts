// @ts-ignore
import {Connection} from 'typeorm';
import {Logger} from 'log4js';
import {IConfig} from '../../core/IConfig';

declare global {
    namespace Express {
        interface Application {
            config: IConfig
            logger: Logger
            endpoints: {
                path: string,
                controller: string,
                method: string,
                httpMethod: string
            }[]
        }
        interface User {
            id: string,
            roles: string[],
            clientIpAddress: string,
            clientAgent: string,
            expiredAt: Date,
            token: string,
            model: any
        }
        interface Request {
            logger: Logger,
            database: Connection,
            roles: string[],
            services: any
        }
    }
}