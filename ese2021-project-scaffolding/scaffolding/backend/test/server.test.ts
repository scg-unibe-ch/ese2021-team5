import express, { Application , Request, Response, Router } from 'express';
import morgan from 'morgan';
import {request} from 'http';
import {promisify} from 'util';
/* const fetch = (info) => promisify(request(info, (req) => {return req } */;
import { Sequelize } from 'sequelize';



import cors from 'cors';
/* import {AdminController} from './controllers/admin.controller';
import {ItemImage} from './models/itemImage.model';
import multer, {diskStorage} from 'multer';
import {PostImage} from './models/postImage.model'; */
//import { StorefrontController } from './controllers/storefront.controller';
import { parseQuery } from '../src/middlewares/parseRequest';

const app: Router = express.Router();
//app.use('/:categoryName', parseQuery);
app.get('/:categoryName', (req: Request<any,any,any, ParsedQuery>, res: Response) => {
    console.log(`REQ.query`, req.query, req.params);
});
const StorefrontController = app;

  class Server {
      server: Application;
    private sequelize: Sequelize;
    private port = process.env.PORT || 3000;



    constructor() {
        this.server = this.configureServer();
        this.sequelize = this.configureSequelize();





        this.sequelize.sync().then(() => {                           // create connection to the database
            this.server.listen(this.port, () => {                                   // start server on specified port
                console.log(`server listening at http://localhost:${this.port}`);   // indicate that the server has started
            });
        });
    }

    private configureServer(): Application {
        // options for cors middleware
        const options: cors.CorsOptions = {
            allowedHeaders: [
                'Origin',
                'X-Requested-With',
                'Content-Type',
                'Accept',
                'X-Access-Token',
            ],
            credentials: true,
            methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
            origin: `http://localhost:${this.port}`,
            preflightContinue: false,
        };

        return express()
            .use(cors())
            .use(express.json())                    // parses an incoming json to an object
            .use(morgan('tiny'))                    // logs incoming requests
            .use('/store', StorefrontController)
            .options('*', cors(options))
            .use('/public', express.static('./uploads'))
            .use(express.static('./src/public'))
            // this is the message you get if you open http://localhost:3000/ when the server is running
            .get('/', (req, res) => res.send('<h1>Welcome to the ESE-2021 Backend Scaffolding <span style="font-size:50px">&#127881;</span></h1>'));
    }

    private configureSequelize(): Sequelize {
        return new Sequelize({
            dialect: 'sqlite',
            storage: 'db.sqlite',
            logging: false // can be set to true for debugging
        });
    }
}

interface ParsedQuery {
    page: number
}


let server: Server;
async function setup1(){
    server = new Server(); // starts the server



 
}

async function test1(){
    console.log(`server`, server.server.options)
    const a = request(`http://localhost:3000/store/testcat?page=2`, (res) => {
    console.log(`A`, a);

    });
}

setup1().then(() => {
   // test1();
});