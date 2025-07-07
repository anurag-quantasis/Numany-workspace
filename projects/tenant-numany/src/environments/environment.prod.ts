import { environment as devEnv } from './environment.dev';
const version = '0.1.0';

export const environment = {
  ...devEnv,
  production: true,
  appVersion: version,
  apiUrl: 'https://1199-110-227-208-213.ngrok-free.app/api',
};
