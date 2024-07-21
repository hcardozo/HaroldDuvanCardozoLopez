import { TestBed } from '@angular/core/testing';

import { AlertService } from './alert.service';
import { Alert } from '../interfaces/alert.interface';
import { AlertType } from '../enums/alert-enum';

describe('AlertService', () => {
  let service: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('debe setear hardTimer cuando se llama a showAlert', () => {
    const timer = 5000;
    service.showAlert(AlertType.SUCCESS, 'Test Alert', timer);
    expect(service.hardTimer).toBe(timer);
  });

  it('debe llamar a setAlert con parametros correctos cuando se llama showAlert', () => {
    const alert: Alert = { type: AlertType.SUCCESS, text: 'Test Alert' };
    jest.spyOn(service as any, 'setAlert'); // Spy on the private method setAlert

    service.showAlert(alert.type, alert.text);

    expect((service as any).setAlert).toHaveBeenCalledWith(alert);
  });

  it('debe emitir ua alerta cuando setAlert es llamado', (done) => {
    const alert: Alert = { type: AlertType.SUCCESS, text: 'Test Alert' };

    service.getAlert().subscribe((receivedAlert) => {
      expect(receivedAlert).toEqual(alert);
      done();
    });

    // Call the private method setAlert using a type assertion
    (service as any).setAlert(alert);
  });

  it('debe retornar un observable cuando se llama getAlert', () => {
    const alertObservable = service.getAlert();
    expect(alertObservable.subscribe).toBeDefined();
  });
});
