import {Request, Response, NextFunction, Application, Router} from 'express';
import { verify as jwtVerify } from 'jsonwebtoken';
import { VerifyOptions, SignOptions, JwtHeader, DecodeOptions } from "jsonwebtoken";

declare global {
  namespace Express {
     interface Request {
       jwtBody?: boilerplateAuthApi.JwtBody,
     }
   }
 }

declare namespace boilerplateAuthApi  {

  interface Options {
    jwtSecret:any,
    jwtOptions?:VerifyOptions,
  }

  type MethodType = "post" | "get" | "put" | "delete"

  interface RoutesObject {
    url: string,
    method: MethodType;
    handler: (req:Request, res: Response, next: NextFunction) =>  any,
    scope: null | string[]
  }

  interface StringTMap<T> { [key: string]: T; }

  interface JwtBody extends StringTMap<any>, SignOptions {}
  
}

const boilerplateAuthApi = (app:Application, router:Router, options: boilerplateAuthApi.Options) => {

  const verify = (requiredScope: string[]) => async (req:Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';
      const decoded = <boilerplateAuthApi.JwtBody>jwtVerify(token, options.jwtSecret, options.jwtOptions);
      if (!requiredScope.some(r => decoded.scope.indexOf(r) >= 0)) {
        throw new Error();
      }
      req.jwtBody = decoded;
      return next();
    } catch {
      return res.status(401).json('Unauthorized');
    }
  }

  const bindRoutes = (baseUrl: string, routes:boilerplateAuthApi.RoutesObject[]) => {
    routes.forEach((route) => {
      const middlewares = [];
      if (route.scope === null) {
        delete route.scope;
      } else {
        middlewares.push(verify(route.scope));
      }
      router[route.method](route.url, middlewares, route.handler);
      });
    app.use(baseUrl, router);
  };
  return {
    bindRoutes:bindRoutes,
  }
}

export = boilerplateAuthApi;
