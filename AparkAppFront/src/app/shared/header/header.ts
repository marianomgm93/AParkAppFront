import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/auth-service';
import { ROUTE_COMMANDS } from '../../app.route.segments';

@Component({
  imports: [RouterLinkActive, RouterLink],
  selector: 'header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isAuthenticated = this.authService.isAuthenticated;
  protected readonly userRole = this.authService.userRole;
  protected readonly commands = ROUTE_COMMANDS;

  goToHome() {
    this.router.navigate(ROUTE_COMMANDS.home);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(ROUTE_COMMANDS.home);
  }

}
