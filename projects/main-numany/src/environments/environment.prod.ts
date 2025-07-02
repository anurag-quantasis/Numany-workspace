import { environment as devEnv } from './environment.dev';
const version = '0.1.0';

export const environment = {
  ...devEnv,
  production: true,
  appVersion: version,
  apiUrl: 'https://api.prod.com/',
};
