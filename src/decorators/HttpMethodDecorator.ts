import 'reflect-metadata';

export const ROUTE_METADATA = 'route:metadata';

export enum HttpMethod {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete'
}

export type RouteMetadata = {
    path: string,
    method: HttpMethod,
    methodName: string,
    paramTypes: any[],
}

export function Route(path: string) : any {
    return function(target: object, descriptor: any) {
        Reflect.defineMetadata('route', {
            path: path
        }, target);

        return descriptor;
    }
}

function HttpHelper(path: string, method: HttpMethod) {

    if(!path)
        path = '';

    return function (target: object, methodName: string, descriptor: any) {
        if(!Reflect.hasOwnMetadata(ROUTE_METADATA, target)) {
            Reflect.defineMetadata(ROUTE_METADATA, [], target);
        }

        const metadata: RouteMetadata[] = Reflect.getOwnMetadata(ROUTE_METADATA, target);
        const paramTypes = Reflect.getMetadata('design:paramtypes', target, methodName);

        metadata.push({
            method,
            path,
            methodName,
            paramTypes
        });
    }
}

export const HttpGet = (path?: string) : any => HttpHelper(path, HttpMethod.GET);
export const HttpPost = (path?: string) : any => HttpHelper(path, HttpMethod.POST);
export const HttpPut = (path?: string) : any => HttpHelper(path, HttpMethod.PUT);
export const HttpDelete = (path?: string) : any => HttpHelper(path, HttpMethod.DELETE);
