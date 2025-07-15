import { Injectable, inject } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { User, FeatureCodes, FeatureCode } from '../permissions/role';
import { CookieService } from '../../services/cookie.service';
import { ConfigService } from '../../services/config.service';
import { ApiService } from '../../services/api.service';

// our mock users in a map.
const MOCK_USERS: Record<string, User> = {
  'super@app.com': {
    id: 'user-sa',
    name: 'Super Admin',
    email: 'super@app.com',
    roles: ['super_admin'],
    tenantId: null,
    featureCodes: [], // Added featureCodes property
  },
  'admin@tenant.com': {
    id: 'user-ta',
    name: 'Tenant Admin',
    email: 'admin@tenant.com',
    roles: ['tenant_admin'],
    tenantId: 'hospital-a',
    featureCodes: [], // Added featureCodes property
  },
  'doctor@tenant.com': {
    id: 'physician-123',
    name: 'Dr. Evelyn Reed',
    email: 'doctor@tenant.com',
    roles: ['physician'],
    tenantId: 'hospital-a',
    // Give this user a special permission to test your logic!
    featureCodes: [FeatureCodes.DISCHARGE_ANY_PATIENT],
  },
  'nurse@tenant.com': {
    id: 'user-nurse',
    name: 'Nurse Alex',
    email: 'nurse@tenant.com',
    roles: ['nurse'],
    tenantId: 'hospital-a',
    featureCodes: [], // Added featureCodes property
  },
  'headnurse@tenant.com': {
    id: 'user-hn',
    name: 'Head Nurse Pat',
    email: 'headnurse@tenant.com',
    roles: ['tenant_admin', 'nurse'],
    tenantId: 'hospital-a',
    // Give this user a special permission to test your logic!
    featureCodes: [FeatureCodes.VIEW_CRITICAL_PATIENTS],
  },
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private cookieService = inject(CookieService);
  // INJECT the ConfigService
  private configService = inject(ConfigService);
  apiService = inject(ApiService);
  // DYNAMICALLY get the token key from the ConfigService
  private readonly tokenKey = this.configService.getAuthSettings().accessTokenKey;

  // --- Token Persistence (Now using a dynamic key from config) ---
  getToken(): string | null {
    return this.cookieService.get(this.tokenKey);
  }

  saveToken(token: string): void {
    // The cookie service is generic; it just needs the key we provide.
    this.cookieService.set(this.tokenKey, token);
  }

  removeToken(): void {
    this.cookieService.remove(this.tokenKey);
  }

  // --- API Calls (Mocks) ---
  login(credentials: {
    user_name: string;
    password: string;
  }): Observable<{ token: string; user: User }> {
    // const user = MOCK_USERS[credentials.email];
    // if (user) {
    //   const mockToken = `jwt-mock-token-for-${user.id}`;
    //   return of({ token: mockToken, user: user }).pipe(delay(1000));
    // }

    return this.apiService.post('/Auth/login', credentials);
    return throwError(() => new Error('Invalid credentials')).pipe(delay(1000));
  }

  getUserProfile(): Observable<User> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token found'));
    }
    const userId = token.replace('jwt-mock-token-for-', '');
    const user = Object.values(MOCK_USERS).find((u) => u.id === userId);

    if (user) {
      return of(user).pipe(delay(500));
    }
    return throwError(() => new Error('User not found for token')).pipe(delay(500));
  }
}
