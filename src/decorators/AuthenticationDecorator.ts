import 'reflect-metadata';

export const HTTP_ROLES = 'http:roles';

export type RoleMetadata = {
    methodName: string,
    roles: string[],
    schema: 'allowed' | 'rejected'
}

export function Roles(roles: string[], schema: 'allowed' | 'rejected' = 'allowed') {
    return function (target: object, methodName: string, descriptor: any) {

        if (!Reflect.hasOwnMetadata(HTTP_ROLES, target)) {
            Reflect.defineMetadata(HTTP_ROLES, [], target);
        }

        const metadata: RoleMetadata[] = Reflect.getOwnMetadata(HTTP_ROLES, target);

        metadata.push({
            roles,
            methodName,
            schema
        });

        return descriptor;
    };
}

export function Policy() {
    return function (target: object, descriptor: any) {
    };
}

export function Policies() {
    return function (target: object, descriptor: any) {
    };
}

export function Authorize() {
    return function (target: object, descriptor: any) {
        Reflect.defineMetadata('authorize', true, target);
        return descriptor;
    };
}

export function AllowAnonymous() {
    return function (target: object, descriptor: any) {
        Reflect.defineMetadata('anonymous', true, target);
        return descriptor;
    };
}