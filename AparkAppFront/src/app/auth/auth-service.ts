import { computed, inject, Service, signal } from '@angular/core';
import { AuthResponse, LoginCredentials, RegisterFormModel } from './auth-models';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { UserClient } from '../user/data-access/user-client';
import { User } from '../user/data-access/user';
import { Router } from '@angular/router';
import { ROUTE_COMMANDS } from '../app.route.segments';

@Service()
export class AuthService {
  private readonly userClient = inject(UserClient);
  private readonly _currentUser = signal<User | null>(null);
  private readonly router = inject(Router);
  readonly currentUser = this._currentUser.asReadonly();

  private decodeToken(token: string | null): Record<string, unknown> | null {
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    } catch {
      return null;
    }
  }

  readonly userRole = computed(() => {
    const payload = this.decodeToken(this._accessToken());
    const rawRole = payload?.['roles'] ?? payload?.['role'] ?? payload?.['authorities'];
    return Array.isArray(rawRole) ? (rawRole[0] as string) : (rawRole as string | null);
  });
  private readonly http = inject(HttpClient);
  private readonly authEndpoint = 'http://localhost:8080/api/auth';

  private readonly accessTokenKey = 'accessToken';

  private readonly _accessToken = signal(localStorage.getItem(this.accessTokenKey));
  readonly accessToken = this._accessToken.asReadonly();
  readonly isAuthenticated = computed(() => !!this._accessToken());

  constructor() {
    if (this._accessToken()) {
      this.loadUserProfile();
    }
  }
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
    this._currentUser.set(null);
  }
  private saveTokens(response: AuthResponse) {
    const { token } = response;
    localStorage.setItem(this.accessTokenKey, token);
    this._accessToken.set(token);
    this.loadUserProfile();
  }
  loadUserProfile(): void {
    if (!this.accessToken()) return;
    this.userClient.getMe().subscribe({
      next: (user) => this._currentUser.set(user),
      error: () => this.logout(),
    });
  }
}
