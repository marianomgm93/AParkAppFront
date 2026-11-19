import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth-service';
import { ROUTE_COMMANDS } from '../app.route.segments';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export default class Home {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isAuthenticated = this.authService.isAuthenticated;
  protected readonly commands = ROUTE_COMMANDS;

  logout(): void {
    this.authService.logout();
    this.router.navigate(ROUTE_COMMANDS.home);
  }
}
