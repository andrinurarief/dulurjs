export interface IConfig {
    name: string // app name
    debug: boolean,
    port: number,
    hostname: string,
    server: {
        type: 'http' | 'https' | 'http2',
        ssl: {
            privateKey: string,
            certificate: string
        }
    },
    session: {
        secret: string
    },
    databases: {
        name: 'default' | string,
        type: 'postgres' | 'mssql' | 'mysql',
        host: string,
        port: number,
        username: string,
        password: string,
        database: string,
        schema?: string,
        synchronize?: boolean
        logging?: 'query' | 'error' [],
        logger?: 'advanced-console',
        connectionTimeout: number,
        entities: string[]
    }[],
    controller: {
        path: string
    },
    service: {
        path: string
    },
    views: {
        spa: boolean,
        framework: 'angular' | 'react' | 'vue' | 'vanilla'
        index: string,
        engine: 'pug' | 'ejs' | 'hbs',
        path: string,
    },
    jwt: {
        secret: string,
        stored: 'local-storage' | 'cookies',
        authorizationPrefix: string
    },
}