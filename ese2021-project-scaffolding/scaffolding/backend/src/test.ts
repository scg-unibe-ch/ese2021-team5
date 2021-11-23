import { Result } from './types';
import express, { Router, Request, Response } from 'express';
import { ProductService } from './services/product.service';



const wrapA = (result: Result, response: Response) => {
    if (result.success){
        response.status(200);
    } else if (result.success === false){
        response.status(404);
    }
}


type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

type ClassTyp2e<T> = T extends (...args: any[]) => infer R ? R : any;

type ClassType2<T = any> = T extends {new(...a: any[]): infer R} ? R : any;

 type ClassType<T = any> = T extends ((...args: any[]) => infer R) & { name: string, prototype: any } ? R : any;


const errors = new Errors(ProductService);
console.log(errors.serviceName, `dddd, ` );

function main(){
    console.log(`s`, ProductService.prototype)

    console.log(`ASSSS`, errors.service, Object.entries(errors.service), errors.service.name)
    const k = Object.getPrototypeOf(errors.service)
    console.log(errors.serviceName, `dddd, `, k, Object.entries(k));

}
main();

