import { Result } from './types';
import express, { Router, Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { KeyObjectType } from 'crypto';
 
export class ErrorMessageFactory {

    
    /**
     * name of the db table/item kind
     */
    type: string
    constructor(type: string){
        this.setType(type);
    }

    setType(name: string){
        this.type = name
    }
    notFound(input){
        return this.createErrorMessage({
            conflict: `not found`,
            input: input 
        });
    }

    createErrorMessage({conflict, input }: { conflict: string, input: any }){
        const msg = [
            `[ERROR]`, this.type, conflict, input
        ];
        return msg.join(` `);
    }

    er = this.createErrorMessage
}

