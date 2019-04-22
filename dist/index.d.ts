import { Request, Response, NextFunction, Application, Router } from 'express';
import { VerifyOptions, SignOptions } from "jsonwebtoken";
declare global {
    namespace Express {
        interface Request {
            jwtBody?: boilerplateAuthApi.JwtBody;
        }
    }
    namespace boilerplateAuthApi {
        interface JwtBody extends SignOptions {
            [key: string]: any;
        }
        interface Options {
            jwtSecret: any;
            jwtOptions?: VerifyOptions;
        }
        interface RoutesObject {
            url: string;
            handler: (req: Request, res: Response, next: NextFunction) => any;
            scope: null | string[];
            method: 'post' | 'get' | 'put' | 'delete';
        }
    }
}
declare const boilerplateAuthApi: (app: Application, router: Router, options: boilerplateAuthApi.Options) => {
    bindRoutes: (baseUrl: string, routes: boilerplateAuthApi.RoutesObject[]) => void;
};
export = boilerplateAuthApi;
