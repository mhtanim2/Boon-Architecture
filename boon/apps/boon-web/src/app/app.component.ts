import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './core/services';
import { InternationalizationService } from './i18n';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  topbarTheme = 'light';

  menuTheme = 'light';

  layoutMode = 'light';

  menuMode = 'horizontal';

  isRTL = false;

  inputStyle = 'outlined';

  ripple: boolean;

  constructor(
    private primengConfig: PrimeNGConfig,
    private authService: AuthService,
    private internalizationService: InternationalizationService
  ) {}

  ngOnInit() {
    // this.authService.populate();
    this.primengConfig.ripple = true;
    this.internalizationService.setLocalization('en');
  }
}
