import { Request, Response, NextFunction, Application, Router } from 'express';
import { VerifyOptions, SignOptions } from "jsonwebtoken";
declare global {
    namespace Express {
        interface Request {
            jwtBody?: boilerplateAuthApi.JwtBody;
        }
    }
}
declare namespace boilerplateAuthApi {
    interface Options {
        jwtSecret: any;
        jwtOptions?: VerifyOptions;
    }
    type RouteMethod = 'post' | 'get' | 'put' | 'delete';
    interface RoutesObject {
        url: string;
        handler: (req: Request, res: Response, next: NextFunction) => any;
        scope: null | string[];
        method: RouteMethod;
    }
    interface JwtBody extends SignOptions {
        [key: string]: any;
    }
}
declare const boilerplateAuthApi: (app: Application, router: Router, options: boilerplateAuthApi.Options) => {
    bindRoutes: (baseUrl: string, routes: boilerplateAuthApi.RoutesObject[]) => void;
};
export = boilerplateAuthApi;
