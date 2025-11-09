import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CustomLoaderService } from './custom-loader.service';

@Component({
  selector: 'app-custom-loader',
  templateUrl: './custom-loader.component.html',
  styleUrls: ['./custom-loader.component.scss'],
})
export class CustomLoaderComponent implements OnInit, OnDestroy {
  public destroy$: Subject<boolean> = new Subject<boolean>();

  public show = false;

  constructor(private loaderService: CustomLoaderService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loaderService
      .getLoaderState()
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.show = state.show;
        this.setScrollBarVisibility(!this.show);
        this.cdr.markForCheck();
      });
  }

  private setScrollBarVisibility(visible: boolean): void {
    document.body.style.overflow = visible ? 'auto' : 'hidden';
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
