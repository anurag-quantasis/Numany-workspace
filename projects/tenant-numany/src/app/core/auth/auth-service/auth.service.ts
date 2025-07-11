import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthTokenResponse, LoginRequest } from '../auth-store/auth.model';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiService = inject(ApiService);

  login(credentials: LoginRequest): Observable<AuthTokenResponse> {
    return this.apiService.post<AuthTokenResponse>('/Auth/login', credentials);
  }

  decodeJwtToken(token: string): { userId: string; username: string; email: string } | null {
    // No 'const' here
    try {
      const decoded: any = jwtDecode(token);
      if (!decoded) {
        console.warn('JWT decoded to null or undefined.');
        return null;
      }
      return {
        userId: decoded.userId ?? '',
        username: decoded.name ?? decoded.username ?? 'Guest',
        email: decoded.email ?? '',
      };
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      // messageService.add({ // messageService is directly available in this closure
      //   severity: 'warn',
      //   summary: 'Token Error',
      //   detail: 'Could not decode user information from token.',
      // });
      return null;
    }
  }
}
