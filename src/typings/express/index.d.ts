// @ts-ignore
import {Connection} from 'typeorm';
import {Logger} from 'log4js';

declare global {
    namespace Express {
        interface Application {
            config: any
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
            database: Connection,
            roles: string[],
            services: any
        }
    }
}