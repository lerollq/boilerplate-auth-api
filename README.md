Little boilerplate to create public and private API.
Based on Express and Jsonwebtoken


# Install

```bash
$ npm install boilerplate-auth-api
```

# Usage

### routes(app, express.Router(), options?).bindRoutes(baseUrl, Routes)

`options`:
 * `jwtSecret` is your jsonwebtoken secret or Private key
 * `jwtOptions?`: JsonWebToken Options, [more info here](https://github.com/auth0/node-jsonwebtoken/blob/master/README.md#jwtverifytoken-secretorpublickey-options-callback)

```js

const routes = require('boilerplate-auth-api');

const JWT_SECRET = 'MYAWESOMESECRET';


const publicHandler = (req, res, next) => res.status(200).send('Hello World !');

const userHandler = (req, res, next) => res.status(200).send(req.user);

const multipleScopeHandler = (req, res, next) => res.status(200).send(req.user);

const authHandler = (req, res, next) => res.status(200).send(req.user);

routes(app, express.Router(), {
  jwtSecret: JWT_SECRET,
}).bindRoutes('/api/v1', [
    /*Public Routes */
    {method:"get", url:'/helloWorld', handler:publicHandler, scope:null},
    /*Route for USER only */
    {method:"get", url:'/user', handler:userHandler, scope: ['user']},
    /*Route for USER && MODERATOR scope only */
    {method:"get", url:'/multipleScope', handler:multipleScopeHandler, scope: ['user', 'moderator']},
    /*Route for ADMIN scope only */
    {method:"get", url:'/admin', handler:adminHandler, scope: ['admin']},
  ]
);

```

```js
const {sign} = require('jsonwebtoken');

const token = sign({
  uid:'user/123456789',
  username: 'Lerollq',
  scope:['user', 'moderator']
}, JWT_SECRET, {
  subject:'my-email@gmail.com',
  issuer:'Issuer',
  algorithm:'HS512'
});


// Token = eyJhbGciOiJIUzI1NiIsIn......
// Set Token in Authorization headers as Bearer Token
// Like 'Bearer eyJhbGciOiJIUzI1NiIsIn......'

get("/api/v1/helloWorld")
/*
 Will result in
 Status: 200
 Response:  {
   'Hello World !'
  }
*/

get("/api/v1/user")
/*
 Will result in
 Status: 200
 Response: {
    "uid": "user/123456789",
    "username": "Lerollq",
    "scope": [
        "user",
        "moderator"
    ],
    "iat": 1555951799,
    "iss": "Issuer",
    "sub": "my-email@gmail.com"
  }
*/

get("/api/v1/multipleScope")
/*
 Will result in
 Status: 200
 Response: {
    "uid": "user/123456789",
    "username": "Lerollq",
    "scope": [
        "user",
        "moderator"
    ],
    "iat": 1555951799,
    "iss": "Issuer",
    "sub": "my-email@gmail.com"
  }
*/

get("/api/v1/admin")
/* 
 Will result in
 Status: 401
 Response: {
   'Unauthorized'
  }
*/

```