import { Injectable } from '@angular/core';
import { environment } from 'projects/main-numany/src/environments/environment';

type AppEnv = typeof environment;

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor() {}

  getEnvironment(): AppEnv {
    return environment;
  }

  isProd(): boolean {
    return environment.production;
  }

  getVersion(): string {
    return environment.appVersion;
  }

  getAPIUrl(): string {
    return environment?.apiUrl ?? '';
  }

  getAuthSettings(): AppEnv['auth'] {
    return environment?.auth;
  }
}
