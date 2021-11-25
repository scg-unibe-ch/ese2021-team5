import express, { Router, Request, Response } from 'express';




export const enum PTypes {
    String = 'string',
    Number = 'number',
    Array = 'object'
}
export interface RequestParserSpec {
    [key: string]: {
        type?: PTypes 
        // stateful
        transform(input): void|Promise<void> 
        }
}

export class RequestParser {
    spec
    constructor(spec: RequestParserSpec){
        this.setSpec(spec);
    }
    setSpec(spec: RequestParserSpec){
        this.spec = spec
    }

    apply(req: Request){
        for (const [key,val] of Object.entries(req.query)){
            const transformer = this.spec[key];
            if (transformer && typeof transformer.transform === 'function'){
                transformer.transform(req.query);
            }
        }
        return req;
    }

}


