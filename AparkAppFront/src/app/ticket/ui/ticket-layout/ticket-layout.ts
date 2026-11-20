import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-ticket-layout',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  styles: [':host { display: contents; }'],
})
export default class TicketLayout {}
