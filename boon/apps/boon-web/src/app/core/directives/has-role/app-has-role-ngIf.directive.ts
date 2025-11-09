import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../services';
@Directive({
  selector: '[appHasRoleNgIf]',
  standalone: true,
})
export class HasRoleNgIfDirective implements OnInit {
  @Input() appHasRoleNgIf: string[] = [];

  isVisible = false;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    const hasAtLeastOneRole = await this.authService.checkRoles(...this.appHasRoleNgIf);
    if (hasAtLeastOneRole) {
      if (!this.isVisible) {
        this.isVisible = true;
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    } else {
      this.isVisible = false;
      this.viewContainerRef.clear();
    }
  }
}
