import { Component } from '@angular/core';
import { Alert } from '../../interfaces/alert.interface';
import { AlertService } from '../../services/alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  alert?: Alert;
  timeoutId?: number;
  customTimer?: number = 3000;

  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
    this.alertService.getAlert().subscribe((alert) => {
      this.alert = alert;
      this.resetTimer();
    });
  }

  resetTimer(): void {
    this.customTimer = this.alertService.hardTimer;
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
    this.timeoutId = window.setTimeout(() => {
      this.alert = undefined;
    }, this.customTimer);
  }
}
