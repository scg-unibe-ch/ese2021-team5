import { Request, Response } from 'express';


export interface Middleware {
    (req: Request, res: Response, next?: Function): void|Promise<void>
}

export interface Result<T = {}> {
    success: boolean;
    data?: T;
    // error message
    message?: string;
}
