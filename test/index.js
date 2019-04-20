const express = require('express');
const http = require('http');
const {sign} = require('jsonwebtoken');
const {routes} = require('../dist/');

const app = express();
const server = new http.Server(app);

const JWT_SECRET = 'MYAWESOMESECRET';

const token = sign({
  username: 'Lerollq',
  id:'123456789',
  role: 'USER',
  email:'my-email@gmail.com'
}, JWT_SECRET, {issuer:'Issuer'});

/*
  console.log(token); 
  Token:
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ikxlcm9sbHEiLCJpZCI6IjEyMzQ1Njc4OSIsInJvbGUiOiJVU0VSIiwiZW1haWwiOiJteS1lbWFpbEBnbWFpbC5jb20iLCJpYXQiOjE1NTU3OTA3NzYsImlzcyI6Iklzc3VlciJ9.M7JwTZEoFKbpobz0ULktRECPEr_UKd3ccUucB9XRkmc
*/

const publicHandler = (req, res, next) => res.status(200).send('Hello World !');

const privateHandler = (req, res, next) => res.status(200).send(req.user);

routes(app, express.Router(), {
  jwtSecret: JWT_SECRET,
  jwtOptions:{
    issuer:'Issuer'
  }
}).bindRoutes('/api/v1', {
  "public": [
    {method:"get", url:'/helloWorld', handler:publicHandler, auth:null}
  ],
  "private":[
    {method:"get", url:'/me', handler:privateHandler, auth: ['USER']}
  ]
});

const port = process.env.PORT || 3001;
// Start server listenner
server.listen(port);

console.log('Server is Listenning on port', port)

