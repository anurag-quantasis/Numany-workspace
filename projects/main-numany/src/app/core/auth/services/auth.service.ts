import { Injectable } from "@angular/core";
import { delay, Observable, of, throwError } from "rxjs";
import { User } from "../auth-store/auth.state";

// For cleaner code, let's define our mock users in a map.
const MOCK_USERS: Record<string, User> = {
  // 1. Super Admin: Manages the entire system
  'super@app.com': {
    id: 'user-sa',
    name: 'Super Admin',
    email: 'super@app.com',
    roles: ['super_admin'],
    tenantId: null, // Super admin might not belong to a specific tenant
  },
  // 2. Tenant Admin: Full control within their tenant
  'admin@tenant.com': {
    id: 'user-ta',
    name: 'Tenant Admin',
    email: 'admin@tenant.com',
    roles: ['tenant_admin'],
    tenantId: 'hospital-a',
  },
  // 3. Physician: Can manage their assigned patients
  'doctor@tenant.com': {
    id: 'physician-123',
    name: 'Dr. Evelyn Reed',
    email: 'doctor@tenant.com',
    roles: ['physician'],
    tenantId: 'hospital-a',
  },
  // 4. Nurse: Can view all patients and manage beds
  'nurse@tenant.com': {
    id: 'user-nurse',
    name: 'Nurse Alex',
    email: 'nurse@tenant.com',
    roles: ['nurse'],
    tenantId: 'hospital-a',
  },
  // 5. A user with multiple roles (e.g., a head nurse who is also an admin)
  'headnurse@tenant.com': {
      id: 'user-hn',
      name: 'Head Nurse Pat',
      email: 'headnurse@tenant.com',
      roles: ['tenant_admin', 'nurse'],
      tenantId: 'hospital-a',
  }
};

const TOKEN_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // --- Token Persistence ---
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  // --- API Calls (Mocks) ---
  login(credentials: { email: string; password: string }): Observable<{ token: string; user: User }> {
    // In a real app, this would be an HttpClient post request
    const user = MOCK_USERS[credentials.email];
    
    // Check if the user exists in our mock database
    if (user) {
      const mockToken = `jwt-mock-token-for-${user.id}`;
      // In a real app, this delay would be an HTTP request
      return of({ token: mockToken, user: user }).pipe(delay(1000));
    }
    return throwError(() => new Error('Invalid credentials')).pipe(delay(1000));
  }

  // Fetches user profile based on the stored token
  getUserProfile(): Observable<User> {
    // In a real app, you'd send the token to a `/me` or `/profile` endpoint
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token found'));
    }
    const mockUser: User = {
      id: '1', name: 'Jane Doe', email: 'test@example.com', roles: ['tenant_admin'],
      tenantId: 'hospital-a'
    };
    return of(mockUser).pipe(delay(500));
  }
}
