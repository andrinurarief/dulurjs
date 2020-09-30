import {Application} from './Application';

export * from './decorators';
export * from './Application';

const app: Application = new Application({
    configName: 'app.js',
    configDir: './configs'
});
