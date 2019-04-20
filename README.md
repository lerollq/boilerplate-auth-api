Little boilerplate to create public and private API.
Based on Express and Jsonwebtoken


# Install

```bash
$ npm install boilerplate-auth-api
```

# Usage

### routes(app, express.Router(), options?).bindRoutes(baseUrl, Routes)

`options?`:
 * `jwtSecret` is your jsonwebtoken secret or Private key
 * `jwtOptions`: JsonWebToken Options, [more info here](https://github.com/auth0/node-jsonwebtoken/blob/master/README.md#jwtverifytoken-secretorpublickey-options-callback)

```js

const {routes} = require('boilerplate-auth-api');

const JWT_SECRET = 'MYAWESOMESECRET';


const publicHandler = (req, res, next) => res.status(200).send('Hello World !');

const userHandler = (req, res, next) => res.status(200).send(req.user);

const moderatorHandler = (req, res, next) => res.status(200).send(req.user);

const authHandler = (req, res, next) => res.status(200).send(req.user);

routes(app, express.Router(), {
  jwtSecret: JWT_SECRET,
  jwtOptions:{
    issuer:'Issuer'
  }
}).bindRoutes('/api/v1', {
    /*Public Routes */
    {method:"get", url:'/helloWorld1', handler:publicHandler, auth:null},

    /*Route for USER only */
    {method:"get", url:'/user', handler:userHandler, auth: ['USER']},

    /*Route for MODERATOR only */
    {method:"get", url:'/moderator', handler:moderatorHandler, auth: ['MODERATOR']},

    /*Route for USER & MODERATOR */
    {method:"get", url:'/auth', handler:authHandler, auth: ['USER', 'MODERATOR']},
  ]
});

```

```js
const {sign} = require('jsonwebtoken');

const token = jwt.sign({
  username: 'Lerollq',
  id:'123456789',
  role: 'USER',
  email:'my-email@gmail.com'
}, JWT_SECRET, {issuer:'Issuer'});


// Token = eyJhbGciOiJIUzI1NiIsIn......
// Set Token in Authorization headers as Bearer Token
// Like 'Bearer eyJhbGciOiJIUzI1NiIsIn......'

get("/api/v1/helloWorld1")
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
    "username": "Lerollq",
    "id": "123456789",
    "role": "USER",
    "email": "my-email@gmail.com",
    "iat": 1555790776,
    "iss": "Issuer"
  }
*/


get("/api/v1/moderator")
/* 
 Will result in
 Status: 401
 Response: {
   'Unauthorized'
  }
*/

get("/api/v1/auth")
/*
 Will result in
 Status: 200
 Response: {
    "username": "Lerollq",
    "id": "123456789",
    "role": "USER",
    "email": "my-email@gmail.com",
    "iat": 1555790776,
    "iss": "Issuer"
  }
*/

```