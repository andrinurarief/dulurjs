export function Service(serviceName: string) {

    return function(target: object, descriptor: any) {
        Reflect.defineMetadata('http:service', serviceName, target);
        return descriptor;
    }

}