import path = require('path');
import Config from '../env';
import swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition: any = {
  openapi: '3.0.0',
  info: {
    // API informations (required)
    title: 'Admin Node API', // Title (required)
    version: Config.version, // Version (required)
    description: 'Admin Node Docs', // Description (optional)
  },
  servers: [
    { url: `http://${Config.host}:${Config.port}` },
    { url: `http://${Config.host}` },
    { url: Config.serverUri },
  ],
};

const options: any = {
  swaggerDefinition,
  apis: [path.join(__dirname, '../../../src/**/**/*.ts'), path.join(__dirname, '../../../src/**/**/*.yaml')], // <-- not in the definition, but in the options,
};

export const swaggerSpec: any = swaggerJSDoc(options);
