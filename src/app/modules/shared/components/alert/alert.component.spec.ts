import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';
import { AlertComponent } from './alert.component';
import { AlertService } from '../../services/alert.service';
import { Alert } from '../../interfaces/alert.interface';
import { AlertType } from '../../enums/alert-enum';

// Mock de AlertService
const alertServiceMock = {
  getAlert: jest.fn(),
  hardTimer: 3000,
};

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;
  let alertService: AlertService;
  let spy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertComponent],
      providers: [{ provide: AlertService, useValue: alertServiceMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    alertService = TestBed.inject(AlertService);
    spy = jest.spyOn(alertService, 'getAlert');
  });

  afterEach(() => {
    if (component.timeoutId) {
      clearTimeout(component.timeoutId);
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe suscribirse a alertService y setear alert al iniciar', () => {
    const mockAlert: Alert = { type: AlertType.SUCCESS, text: 'Test alert' };
    spy.mockReturnValue(of(mockAlert));

    fixture.detectChanges(); // Trigger ngOnInit

    expect(component.alert).toEqual(mockAlert);
  });

  it('debe resetear el timer cuando alert cambia', () => {
    const mockAlert: Alert = { type: AlertType.WARNING, text: 'Another alert' };
    spy.mockReturnValue(of(mockAlert));
    jest.spyOn(window, 'setTimeout');

    fixture.detectChanges(); // Trigger ngOnInit

    expect(component.alert).toEqual(mockAlert);
    expect(window.setTimeout).toHaveBeenCalledWith(expect.any(Function), alertService.hardTimer);
  });

});
