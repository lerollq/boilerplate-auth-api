const  express = require('express');
const http = require('http');
const {sign} = require('jsonwebtoken');
const routes = require('../dist');
const app = express();
const server = new http.Server(app);

const JWT_SECRET = 'MYAWESOMESECRET';
// const token = sign({
//   username: 'Lerollq',
//   id:'123456789',
//   role: 'USER',
//   email:'my-email@gmail.com'
// }, JWT_SECRET, {issuer:'Issuer'});

/*
  console.log(token); 
  Token:
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ikxlcm9sbHEiLCJpZCI6IjEyMzQ1Njc4OSIsInJvbGUiOiJVU0VSIiwiZW1haWwiOiJteS1lbWFpbEBnbWFpbC5jb20iLCJpYXQiOjE1NTU3OTA3NzYsImlzcyI6Iklzc3VlciJ9.M7JwTZEoFKbpobz0ULktRECPEr_UKd3ccUucB9XRkmc
*/

const publicHandler = (req, res, next) => res.status(200).send('Hello World !');

const userHandler = (req, res, next) => res.status(200).send(req.user);

const moderatorHandler = (req, res, next) => res.status(200).send(req.user);

const authHandler = (req, res, next) => res.status(200).send(req.user);

routes(app, express.Router(), {
  jwtSecret: JWT_SECRET,
}).bindRoutes('/api/v1', [
    /*Public Routes */
    {method:"get", url:'/helloWorld1', handler:publicHandler, auth:null},
    {method:"get", url:'/helloWorld2', handler:publicHandler, auth:null},
    /*Route for USER only */
    {method:"get", url:'/user', handler:userHandler, auth: ['USER']},
    /*Route for MODERATOR only */
    {method:"get", url:'/moderator', handler:moderatorHandler, auth: ['MODERATOR']},
    /*Route for USER & MODERATOR */
    {method:"get", url:'/auth', handler:authHandler, auth: ['USER', 'MODERATOR']},
  ]
);

const port = process.env.PORT || 3001;
// Start server listenner
server.listen(port);

console.log('Server is Listenning on port', port)

