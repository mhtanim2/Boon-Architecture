import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-notfound',
  templateUrl: './app.notfound.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
})
export class AppNotfoundComponent {}
