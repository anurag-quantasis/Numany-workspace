import { environment as devEnv } from './environment.dev';
const version = '0.1.0';

export const environment = {
  ...devEnv,
  production: true,
  appVersion: version,
  apiUrl: 'https://3c2ba651778b.ngrok-free.app/api',
};
