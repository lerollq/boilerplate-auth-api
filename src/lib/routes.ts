import * as Express from "express";
import { verify as jwtVerify, VerifyOptions } from 'jsonwebtoken';


declare global {
  namespace Express {
    interface Request {
      user: JWTPayload,
    }
  }
}

interface RegisteredClaim {
  /**The "iss" (issuer) claim identifies the principal that issued the
   JWT.  The processing of this claim is generally application specific.
   The "iss" value is a case-sensitive string containing a StringOrURI
   value.  Use of this claim is OPTIONAL.*/
  iss: any,
  /**The "sub" (subject) claim identifies the principal that is the
   subject of the JWT.  The claims in a JWT are normally statements
   about the subject.  The subject value MUST either be scoped to be
   locally unique in the context of the issuer or be globally unique.
   The processing of this claim is generally application specific.  The
   "sub" value is a case-sensitive string containing a StringOrURI
   value.  Use of this claim is OPTIONAL. */
  sub:any
  /**The "aud" (audience) claim identifies the recipients that the JWT is
   intended for.  Each principal intended to process the JWT MUST
   identify itself with a value in the audience claim.  If the principal
   processing the claim does not identify itself with a value in the
   "aud" claim when this claim is present, then the JWT MUST be
   rejected.  In the general case, the "aud" value is an array of case-
   sensitive strings, each containing a StringOrURI value.  In the
   special case when the JWT has one audience, the "aud" value MAY be a
   single case-sensitive string containing a StringOrURI value.  The
   interpretation of audience values is generally application specific.
   Use of this claim is OPTIONAL. */
  aud:any,
   /** The "exp" (expiration time) claim identifies the expiration time on
   or after which the JWT MUST NOT be accepted for processing.  The
   processing of the "exp" claim requires that the current date/time
   MUST be before the expiration date/time listed in the "exp" claim. */
  exp:any,
  /**The "nbf" (not before) claim identifies the time before which the JWT
   MUST NOT be accepted for processing.  The processing of the "nbf"
   claim requires that the current date/time MUST be after or equal to
   the not-before date/time listed in the "nbf" claim.  Implementers MAY
   provide for some small leeway, usually no more than a few minutes, to
   account for clock skew.  Its value MUST be a number containing a
   NumericDate value.  Use of this claim is OPTIONAL. */
   nbf: number,
   /**The "iat" (issued at) claim identifies the time at which the JWT was
   issued.  This claim can be used to determine the age of the JWT.  Its
   value MUST be a number containing a NumericDate value.  Use of this
   claim is OPTIONAL. */
   iat:number,
   /**The "jti" (JWT ID) claim provides a unique identifier for the JWT.
   The identifier value MUST be assigned in a manner that ensures that
   there is a negligible probability that the same value will be
   accidentally assigned to a different data object; if the application
   uses multiple issuers, collisions MUST be prevented among values
   produced by different issuers as well.  The "jti" claim can be used
   to prevent the JWT from being replayed.  The "jti" value is a case-
   sensitive string.  Use of this claim is OPTIONAL. */
   jti:string,
}
interface UserPayload {
  username?: string;
  id?: string,
  email?: string,
  role: string, 
}

interface JWTPayload extends RegisteredClaim, UserPayload {}

interface Routes {
  /**Url access ( /api/v1/routeName ) */
  url: string,
  /**Method access */
  method: 'post' | 'get' | 'put' | 'delete';
  /**Handler redirection */
  handler: (req:Express.Request, res: Express.Response, next: Express.NextFunction) => any,
  /**Null = public method, If some datas provided, jwt middleware will check if the string array includes user.role in decoded token payload  */
  auth: null | string[]
}


interface Options {
  jwtSecret:any,
  jwtOptions?:VerifyOptions,
}

export default  (app:Express.Application, router:Express.Router, options: Options) => {

  const verify = (requiredRole: string[]) => async (req:Express.Request, res: Express.Response, next: Express.NextFunction) => {
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

  const bindRoutes = (baseUrl: string, routes:Routes[]) => {
    routes.forEach((route) => {
      const middlewares = [];
      if (route.auth === null) {
        delete route.auth;
      } else {
        middlewares.push(verify(route.auth));
      }
      router[route.method](route.url, middlewares, route.handler);
      });
    app.use(baseUrl, router);
  };
  return {
    bindRoutes:bindRoutes,
  }
}
