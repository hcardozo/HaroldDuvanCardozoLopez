import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs';
import { AlertService } from '../services/alert.service';
import { AlertType } from '../enums/alert-enum';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  let alertService = inject(AlertService);
  return next(req).pipe(catchError((httpError: HttpErrorResponse) => {
    alertService.showAlert(AlertType.DANGER, `Opss ha ocurrido un error interno.`, 10000);
    throw httpError;
  }));
};
