import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent], // <--- IMPORTANTE
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class LayoutComponent {}