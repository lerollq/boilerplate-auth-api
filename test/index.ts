import * as express from 'express';
import * as http from 'http';
import {sign} from 'jsonwebtoken';
import routes  from '../dist';

const app = express();
const server = new http.Server(app);

const JWT_SECRET = 'MYAWESOMESECRET';

const token = sign({
  uid:'user/123456789',
  username: 'Lerollq',
  scope:['user', 'moderator']
}, JWT_SECRET, {
  subject:'my-email@gmail.com',
  issuer:'Issuer',
  algorithm:'HS512'
});
/*
  console.log(token); 
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2V...
*/

const publicHandler = (req: express.Request, res: express.Response, next:express.NextFunction) => res.status(200).send('Hello World !');

const userHandler = (req: express.Request, res: express.Response, next:express.NextFunction) => res.status(200).send(req.jwtBody);

const multipleScopeHandler = (req: express.Request, res: express.Response, next:express.NextFunction) => res.status(200).send(req.jwtBody);

const adminHandler = (req: express.Request, res: express.Response, next:express.NextFunction) => res.status(200).send(req.jwtBody);



routes(app, express.Router(), {
  jwtSecret: JWT_SECRET,
}).bindRoutes('/api/v1', [
    /*Public Routes */
    {method:"get", url:'/helloWorld', handler:publicHandler, scope:null},
    /*Route for USER only */
    {method:"post", url:'/user', handler:userHandler, scope: ['user']},
    /*Route for USER && MODERATOR scope only */
    {method:"get", url:'/multipleScope', handler:multipleScopeHandler, scope: ['user', 'moderator']},
    /*Route for ADMIN scope only */
    {method:"get", url:'/admin', handler:adminHandler, scope: ['admin']},
  ]
);

const port = process.env.PORT || 3001;
// Start server listenner
server.listen(port);

console.log('Server is Listenning on port', port)

