import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ROUTE_COMMANDS } from '../app.route.segments';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export default class Home {
  protected readonly commands = ROUTE_COMMANDS;
}
