import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

/**
 * A generic wrapper around the Angular HttpClient.
 * It is responsible for prepending the environment's apiUrl.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);
  private baseUrl = this.configService.getAPIUrl();

  /**
   * Performs a GET request.
   */
  get<T>(
    endpoint: string,
    options?: { params?: HttpParams; headers?: HttpHeaders },
  ): Observable<T> {
    return this.http.get<T>(this.baseUrl + endpoint, options);
  }

  /**
   * Performs a POST request.
   */
  post<T>(
    endpoint: string,
    body: any,
    options?: { params?: HttpParams; headers?: HttpHeaders },
  ): Observable<T> {
    return this.http.post<T>(this.baseUrl + endpoint, body, options);
  }

  /**
   * Performs a PUT request.
   */
  put<T>(
    endpoint: string,
    body: any,
    options?: { params?: HttpParams; headers?: HttpHeaders },
  ): Observable<T> {
    return this.http.put<T>(this.baseUrl + endpoint, body, options);
  }

  /**
   * Performs a PATCH request.
   */
  patch<T>(
    endpoint: string,
    body: any,
    options?: { params?: HttpParams; headers?: HttpHeaders },
  ): Observable<T> {
    return this.http.patch<T>(this.baseUrl + endpoint, body, options);
  }

  /**
   * Performs a DELETE request.
   */
  delete<T>(
    endpoint: string,
    options?: { params?: HttpParams; headers?: HttpHeaders },
  ): Observable<T> {
    return this.http.delete<T>(this.baseUrl + endpoint, options);
  }
}
