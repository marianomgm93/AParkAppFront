import { computed, inject, Service, signal } from '@angular/core';
import { AuthResponse, LoginCredentials, RegisterFormModel } from './auth-models';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authEndpoint = 'http://localhost:8080/api/auth';

  private readonly accessTokenKey = 'accessToken';
  
  private readonly _accessToken = signal(localStorage.getItem(this.accessTokenKey));
  readonly accessToken = this._accessToken.asReadonly();
  readonly isAuthenticated = computed(() => !!this._accessToken());

  register(user: RegisterFormModel) {
    return this.http.post<AuthResponse>(this.authEndpoint + '/register', user).pipe(
      tap((response) => {
        this.saveTokens(response);
      }),
    );
  }

  login(credentials: LoginCredentials) {
    return this.http.post<AuthResponse>(this.authEndpoint + '/login', credentials).pipe(
      tap((response) => {
        this.saveTokens(response);
      }),
    );
  }

  logout() {
    localStorage.removeItem(this.accessTokenKey);
    this._accessToken.set(null);
  }

  private saveTokens(response: AuthResponse) {
    // CORRECCIÓN: El backend de Spring Boot / server.js devuelve 'token', no 'accessToken'
    const { token } = response;

    // Guardamos el token usando la clave 'accessToken' en el localStorage
    localStorage.setItem(this.accessTokenKey, token);
    this._accessToken.set(token);
  }
}

