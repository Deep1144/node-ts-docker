### Project Introduction
- using tslint followed [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

## Requirements

- node >= 10
- npm >= 6
- mongodb >= 3.0
- typescript >= 3.0

## App skeleton
```
.
├── LICENSE
├── README.md
├── nodemon.json
├── package.json
├── src
│   ├── components
│   │   ├── Auth
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.interface.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.router.ts
│   │   ├── index.ts
│   │   
│   ├── config
│   │   ├── connection
│   │   │   └── connection.ts
│   │   ├── env
│   │   │   └── index.ts
│   │   ├── error
│   │   │   ├── index.ts
│   │   │   └── sendHttpError.ts
│   │   ├── middleware
│   │   │   ├── middleware.ts
│   │   │   └── passport.ts
│   │   └── server
│   │       ├── ServerInterface.ts
│   │       ├── index.ts
│   │       ├── server.ts
│   │       └── serverHandlers.ts
│   └── routes
│       ├── AuthRouter.ts
│       ├── UserRouter.ts
│       └── index.ts
├── swagger.json
├── swaggerDef.js
├── tsconfig.json
└── tslint.json
```
## Running the API

### Dockermode

To start in `development` mode with docker, run:
```
docker build .
npm run docker:dev
```

To run `production` server using docker, run:
```
npm run docker
```
### Development
To start the application in development mode, run:

```bash
npm install -g nodemon
npm install -g ts-node
npm install -g typescript
npm install
```

Start the application in dev env:
```
nodemon
```
Start the application in production env:

Install ts pm2 and typescript compiler:
```
npm install -g pm2
pm2 install typescript
```

example start with scale on 2 core:
```
pm2 start ./src/index.ts -i 2 --no-daemon
```

Express server listening on http://localhost:3000/, in development mode
The developer mode will watch your changes then will transpile the TypeScript code and re-run the node application automatically.


## Set up environment
In root folder you can find `.env`. You can use this config or change it for your purposes.
If you want to add some new variables, you also need to add them to interface and config object (Look `src/config/index.ts`)

## Swagger
```bash
npm install -g swagger-jsdoc
swagger-jsdoc -d swaggerDef.js -o swagger.json
```
Swagger documentation will be available on route: 
```bash
http://localhost:3000/docs
```
![Alt Text](https://i.ibb.co/b6SdyQV/gif1.gif)
