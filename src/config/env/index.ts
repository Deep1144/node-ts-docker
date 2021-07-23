import * as dotenv from 'dotenv';
import { SERVERURI } from '../../constants/constant';

dotenv.config();

interface IConfig {
  port: string | number;
  secret: string;
  type: string;
  host: string;
  version: string;
  whitelist: string[];
  serverUri: string;
  swagger?: {
    username: string;
    password: string;
  };
  database: {
    uri: string;
    // host: string;
    // port: string;
    // dbName: string;
    // authenticate: {
    //   username: string;
    //   password: string;
    // };
  };
  defaultTokenExpiryTimeInHours: number;
  validation: {
    password: string;
    username: string;
    email: string;
    website: string;
  };
}
const whitelist: string[] = [
  `http://localhost:${process.env.port || 3000}`,
  `http://localhost`,
  `http://127.0.0.1:${process.env.port || 3000}`,
  SERVERURI,
];

const NODE_ENV: string = process.env.NODE_ENV || 'development';

const swagger: any = {
  username: process.env.SWAGGER_DOC_USERNAME,
  password: process.env.SWAGGER_DOC_PASS,
};

const config: IConfig = {
  whitelist,
  swagger,
  type: 'DEV',
  serverUri: SERVERURI,
  host: process.env.DEV_HOST,
  port: process.env.PORT,
  database: {
    uri: process.env.DB_URI,
  },
  version: '1.0.0',
  secret: process.env.DEV_secret,
  defaultTokenExpiryTimeInHours: 24,
  validation: {
    password: '^((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?]).{6,20})$',
    username: '^((?=.*[a-zA-Z0-9]).{6,20})$',
    email: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$',
    website:
      '^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$',
  },
};

// const config: {
//   [name: string]: IConfig;
// } = {
//   development,
// };

export default config;
