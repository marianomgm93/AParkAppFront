import { Component } from '@angular/core';
import { RouterLinkActive } from '@angular/router';

@Component({
  imports: [RouterLinkActive],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {}
