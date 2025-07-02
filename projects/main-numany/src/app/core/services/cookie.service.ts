import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  static readonly APP_PREFIX = 'NG-TEMPLATE-';
  private document = inject(DOCUMENT);

  /**
   * Retrieves a cookie by its name.
   * @param name The name of the cookie to retrieve.
   * @returns The cookie's value, or null if not found.
   */
  get(name: string): string | null {
    if (!this.document.cookie) {
      return null;
    }

    const cookies = this.document.cookie.split(';').map(c => c.trim());
    const cookie = cookies.find(c => c.startsWith(name + '='));

    if (!cookie) {
      return null;
    }

    return decodeURIComponent(cookie.substring(name.length + 1));
  }

  /**
   * Sets a cookie.
   * @param name The name of the cookie.
   * @param value The value of the cookie.
   * @param options Optional settings for the cookie.
   *   - `expiresInHours`: Expiration in hours. Defaults to 2.
   *   - `path`: The path for the cookie. Defaults to '/'.
   *   - `sameSite`: SameSite attribute. Defaults to 'Lax'.
   */
  set(
    name: string,
    value: string,
    options: {
      expiresInHours?: number;
      path?: string;
      sameSite?: 'Lax' | 'Strict' | 'None';
    } = {}
  ): void {
    const {
      expiresInHours = 2, // Default to 2 hours
      path = '/',
      sameSite = 'Lax',
    } = options;

    // URL-encode the value to handle special characters
    const encodedValue = encodeURIComponent(value);

    // Calculate the expiration date
    const date = new Date();
    date.setTime(date.getTime() + expiresInHours * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;

    // Build the cookie string
    let cookieString = `${CookieService.APP_PREFIX}${name}=${encodedValue}; ${expires}; path=${path}; SameSite=${sameSite}`;

    // Add the 'Secure' flag in production for enhanced security
    if (environment.production) {
      cookieString += '; Secure';
    }

    this.document.cookie = cookieString;
  }

  /**
   * Removes a cookie by setting its expiration date to the past.
   * @param name The name of the cookie to remove.
   * @param path The path of the cookie, must match the path used to set it. Defaults to '/'.
   */
  remove(name: string, path: string = '/'): void {
    // To remove a cookie, we set its expiration date to a past date.
    this.document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}