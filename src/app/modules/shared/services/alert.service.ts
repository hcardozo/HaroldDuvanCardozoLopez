import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Alert } from '../interfaces/alert.interface';
import { AlertType } from '../enums/alert-enum';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alert$ = new Subject<Alert>();
  public hardTimer?: number = 3000;
  private setAlert(alert: Alert): void {
    this.alert$.next(alert);
  }

  public getAlert(): Observable<Alert> {
    return this.alert$.asObservable();
  }

  public showAlert(type: AlertType, text: string, timer: number = 3000): void {
    this.hardTimer = timer;
    this.setAlert({ type, text, });
  }
}