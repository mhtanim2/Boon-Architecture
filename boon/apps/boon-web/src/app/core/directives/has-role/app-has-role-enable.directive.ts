import { Directive, ElementRef, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../services';

@Directive({
  selector: '[appHasRoleEnable]',
  standalone: true,
})
export class HasRoleEnableDirective implements OnInit {
  @Input() appHasRoleEnable: string[] = [];

  isEnabled = false;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private element: ElementRef,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    const hasAtLeastOneRole = await this.authService.checkRoles(...this.appHasRoleEnable);
    if (hasAtLeastOneRole) {
      if (!this.isEnabled) {
        this.isEnabled = true;
        this.element.nativeElement.disabled = false;
      }
    } else {
      this.isEnabled = false;
      this.element.nativeElement.disabled = true;
    }
    this.viewContainerRef.createEmbeddedView(this.templateRef);
  }
}
