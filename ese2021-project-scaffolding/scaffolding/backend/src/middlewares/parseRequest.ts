import { Request, Response } from 'express';
import { RequestParser, RequestParserSpec } from '../utils/req-parser';
import { Middleware} from '../utils/types';


/**
 * how to transform the query parameter upon encountering it
 */
const queryTransformers: RequestParserSpec = {
    page: { 
       // type: PTypes.Number,
        transform(queryObject){
            queryObject.page = parseInt(queryObject.page);
        }
    }
}

const queryParser = new RequestParser(queryTransformers);

/**
 * passes req to a request parser that defines a way how to handle and modify the values of req in-place 
 * @param req 
 * @param res 
 * @param next 
 */
export const parseQuery: Middleware = (req: Request, res: Response, next: any) => {
    try {
        queryParser.apply(req);
        next()
        } catch (err) {
            console.error(`ERROR IN PARSE MIDDLEWARE`);
    }
}
