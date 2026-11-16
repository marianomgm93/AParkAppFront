import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/auth-service';
import { ROUTE_COMMANDS } from '../../app.route.segments';

@Component({
  imports: [RouterLinkActive, RouterLink],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isAuthenticated = this.authService.isAuthenticated;
  protected readonly commands= ROUTE_COMMANDS;

  logout() {
    this.authService.logout();
    this.router.navigate(ROUTE_COMMANDS.login);
  }

}
