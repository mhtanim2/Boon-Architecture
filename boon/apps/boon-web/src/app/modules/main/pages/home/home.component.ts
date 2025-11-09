import { Component } from '@angular/core';
import { AppBreadcrumbService } from '../../../ui/app.breadcrumb.service';

@Component({
  selector: 'boon-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private readonly breadcrumbService: AppBreadcrumbService) {
    this.breadcrumbService.setItems([{ label: 'Home' }]);
  }
}
