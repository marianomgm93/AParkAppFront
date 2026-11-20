import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ROUTE_COMMANDS } from '../app.route.segments';
import { AuthService } from '../auth/auth-service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export default class Home {
  protected readonly commands = ROUTE_COMMANDS;
  protected readonly authService= inject(AuthService);
}
