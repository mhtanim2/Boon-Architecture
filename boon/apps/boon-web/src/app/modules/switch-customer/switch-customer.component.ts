import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ActiveTenantResolver } from '@boon/frontend/core/guards/tenant.guard';
import { DEFAULT_TENANT } from '@boon/interfaces/boon-api';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { first } from 'lodash';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ListboxModule } from 'primeng/listbox';
import { UserResDto } from '../../../api/models';
import { AuthService } from '../../core/services';

@UntilDestroy()
@Component({
  selector: 'boon-switch-customer',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, CardModule, ListboxModule, DividerModule, AvatarModule],
  templateUrl: './switch-customer.component.html',
  styleUrls: ['./switch-customer.component.scss'],
})
export class SwitchCustomerComponent {
  user: UserResDto;
  isLoading = false;
  clientsList = [];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private activeTenantResolver: ActiveTenantResolver,
    public authService: AuthService
  ) {
    this.clientsList = this.authService.getCurrentUser().clienti;
    this.isLoading = true;
    this.user = this.authService.getCurrentUser();
    if (this.activeTenantResolver.resolve().slug !== DEFAULT_TENANT.slug) {
      this.router.navigate([DEFAULT_TENANT.slug, 'switch-customer']);
    }
    if (!this.authService.currentUserTenants) {
      this.router.navigate([this.authService.getCurrentUser().clienti[0].tenant.slug]);
    }

    this.isLoading = false;
  }

  logout() {
    this.authService.logout().pipe(untilDestroyed(this)).subscribe();
  }

  goToClientHomePage(event) {
    this.router.navigate(['/', event.value.tenant.slug]);
  }

  clientNameInitials(client) {
    const initials = client.ragioneSociale
      .split(' ')
      .map((token) => first(token))
      .slice(0, 3)
      .join('');
    return initials;
  }
}
