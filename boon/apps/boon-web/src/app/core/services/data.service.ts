import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dataSource = new BehaviorSubject({});
  currentData = this.dataSource.asObservable();

  getData() {
    return this.currentData;
  }

  constructor() {}

  changeData(data: object) {
    this.dataSource.next(data);
  }
}
