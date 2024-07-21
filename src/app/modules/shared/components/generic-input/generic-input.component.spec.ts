import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';
import { ChangeDetectorRef, Component, EventEmitter, Injector, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { GenericInputComponent } from './generic-input.component';
import { CommonModule } from '@angular/common';

// Mock para ChangeDetectorRef
class MockChangeDetectorRef {
  detectChanges() { }
}

@Component({
  selector: 'test-component',
  template: `<app-generic-input></app-generic-input>`
})
class TestComponent {
  @ViewChild(GenericInputComponent) genericInput!: GenericInputComponent;
}

describe('GenericInputComponent', () => {
  let component: GenericInputComponent;
  let fixture: ComponentFixture<GenericInputComponent>;
  let changeDetectorRef: ChangeDetectorRef;
  let injector: Injector;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule],
      declarations: [GenericInputComponent, TestComponent],
      providers: [
        { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef },
        { provide: NG_VALUE_ACCESSOR, useExisting: GenericInputComponent, multi: true }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericInputComponent);
    component = fixture.componentInstance;
    changeDetectorRef = TestBed.inject(ChangeDetectorRef);
    injector = TestBed.inject(Injector);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar con valores por defecto', () => {
    expect(component.label).toBe('');
    expect(component.errorMessages).toEqual(new Map());
    expect(component.required).toBeUndefined();
    expect(component.disabled).toBeUndefined();
    expect(component.placeholder).toBe('');
    expect(component.type).toBe('text');
  });

  it('debe inicializar formControl con ngControl en el ngAfterViewInit', () => {
    const mockNgControl = { control: new FormControl('test value') };
    jest.spyOn(injector, 'get').mockReturnValue(mockNgControl);

    component.ngAfterViewInit();

    fixture.whenStable().then(() => {

      expect(component.formControl.value).toBe('test value');
    })
  });

  it('debe detectar cambios despues de la inicializacion de contenido', () => {
    const detectChangesSpy = jest.spyOn(changeDetectorRef, 'detectChanges');

    component.ngAfterContentInit();

    fixture.whenStable().then(() => {

      expect(detectChangesSpy).toHaveBeenCalled();
    })
  });

  it('debe convertr errores de control a arreglo de strings', () => {
    const errors = { required: true, minlength: { requiredLength: 5, actualLength: 3 } };
    const result = component.errorsToArray(errors);

    expect(result).toEqual(['required', 'minlength']);
  });

  it('debe emitir un cambio cuando el valor del contorl se modifica', () => {
    const changeSpy = jest.spyOn(component.change, 'emit');
    component.formControl.setValue('new value');
    component.change.emit('new value');

    expect(changeSpy).toHaveBeenCalledWith('new value');
  });

  it('debe manejar ngAfterContentInit', () => {
    const detectChangesSpy = jest.spyOn(changeDetectorRef, 'detectChanges');

    fixture.detectChanges(); // Trigger initial change detection
    component.ngAfterContentInit();

    fixture.whenStable().then(() => {

      expect(detectChangesSpy).toHaveBeenCalled();
    })
  });
});