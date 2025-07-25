import { environment as devEnv } from './environment.dev';
const version = '0.1.0';

export const environment = {
  ...devEnv,
  production: true,
  appVersion: version,
  apiUrl: 'http://20.84.43.54:5002/api',
};
