import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ILoaderState {
  show: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CustomLoaderService {
  private loaderSubject = new BehaviorSubject<ILoaderState>({ show: false });
  private loaderState = this.loaderSubject.asObservable();
  private timeout: any;

  constructor() {}

  public getLoaderState(): Observable<ILoaderState> {
    return this.loaderState;
  }

  public show(delay?: number): void {
    if (delay) {
      this.timeout = setTimeout(() => this.loaderSubject.next({ show: true } as ILoaderState), delay);
    } else {
      this.loaderSubject.next({ show: true } as ILoaderState);
    }
  }

  public hide(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.loaderSubject.next({ show: false } as ILoaderState);
  }
}
