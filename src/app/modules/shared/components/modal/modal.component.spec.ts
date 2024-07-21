import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComponent } from './modal.component';
import { ModalService } from '../../services/modal.service';
import { ElementRef } from '@angular/core';
describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  let modalService: jest.Mocked<ModalService>;
  let modalElement: HTMLElement;
  let overlayElement: HTMLElement;

  beforeEach(async () => {
    // Crear un mock del ModalService
    modalService = {
      close: jest.fn(),
      options: undefined,
    } as any;

    await TestBed.configureTestingModule({
      imports: [ModalComponent],
      providers: [
        { provide: ModalService, useValue: modalService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;

    // Crear elementos mock para modal y overlay
    modalElement = document.createElement('div');
    overlayElement = document.createElement('div');
    modalElement.setAttribute('id', 'modal');
    overlayElement.setAttribute('id', 'overlay');

    // Agregar los elementos al DOM
    document.body.appendChild(modalElement);
    document.body.appendChild(overlayElement);

    // Configurar las referencias en el componente
    component.modal = new ElementRef(modalElement) as ElementRef<any>;
    component.overlay = new ElementRef(overlayElement) as ElementRef<any>;
  });

  afterEach(() => {
    // Limpiar el DOM
    document.body.removeChild(modalElement);
    document.body.removeChild(overlayElement);
  });

  it('debe llamar a modalService.close cuando se presiona la tecla Escape', () => {
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
    expect(modalService.close).toHaveBeenCalled();
  });

  it('debe llamar a modalService.close cuando se llama a onClose', () => {
    component.onClose();
    expect(modalService.close).toHaveBeenCalled();
  });

  it('debe setear las opciones del modal correctamente en ngAfterViewInit', () => {
    component.options = {
      size: {
        minWidth: '100px',
        width: '200px',
        maxWidth: '300px',
        minHeight: '150px',
        height: '250px',
        maxHeight: '350px',
      }
    };
    const addOptionsSpy = jest.spyOn(component as any, 'addOptions');
    fixture.detectChanges();


    fixture.whenStable().then(() => {
      expect(addOptionsSpy).toHaveBeenCalled();
      expect(modalElement.style.minWidth).toBe('100px');
      expect(modalElement.style.width).toBe('200px');
      expect(modalElement.style.maxWidth).toBe('300px');
      expect(modalElement.style.minHeight).toBe('150px');
      expect(modalElement.style.height).toBe('250px');
      expect(modalElement.style.maxHeight).toBe('350px');

    });
  });

  it('debe limpiar las opciones del modal y eliminar el elemento del dom cuando se llama a close', () => {
    component.close();
    expect(modalService.options).toBeUndefined();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(document.body.contains(modalElement)).toBeFalsy();
    })
  });
});