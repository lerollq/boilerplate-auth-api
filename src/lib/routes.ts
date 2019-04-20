import { Router, Application } from "express";
import { NextFunction, Request, Response } from 'express';
import { verify as jwtVerify, VerifyOptions } from 'jsonwebtoken';

interface RouteObject {
  /**Url access ( /api/v1/routeName ) */
  url: string,
  /**Method access */
  method: 'post' | 'get' | 'put' | 'delete';
  /**Handler redirection */
  handler: (req:Request, res: Response, next: NextFunction) => any,
  /**Null = public method, If some datas provided, jwt middleware will check if the string array includes user.role in decoded token payload  */
  auth: null | string[]
}

interface Routes {
  [key:string]:RouteObject[]
}

interface Options {
  jwtSecret:any,
  jwtOptions:VerifyOptions,
}

export default  (app:Application, router:Router, options:Options) => {

  const verify = (requiredRole: string[]) => async (req:Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';
      const decoded = <JWTPayload>jwtVerify(token, options.jwtSecret, options.jwtOptions);
      if (!requiredRole.includes(decoded.role)) {
        throw new Error();
      }
      // Set user payload in the request
      req.user = decoded;
      return next();
    } catch {
      return res.status(401).json('Unauthorized');
    }
  }

  const bindRoutes = (baseUrl: string, routes:Routes) => {

    for (let r in routes) {
      routes[r].forEach((route) => {
        const middlewares = [];
        if (route.auth === null) {
          delete route.auth;
        } else {
          middlewares.push(verify(route.auth));
        }
        router[route.method](route.url, middlewares, route.handler);
      });
      app.use(baseUrl, router);
    }
  };
  return {
    bindRoutes:bindRoutes,
  }
}
