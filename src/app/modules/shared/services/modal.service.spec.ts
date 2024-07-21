import { TestBed } from '@angular/core/testing';

import { ModalService } from './modal.service';
import { ComponentRef, ElementRef, EnvironmentInjector, Injectable, Injector, TemplateRef, ViewContainerRef, ViewRef } from '@angular/core';
import { ModalComponent } from '../components/modal/modal.component';
class MockEnvironmentInjector { }

class MockViewContainerRef extends ViewContainerRef {
  override get element(): ElementRef<any> {
    throw new Error('Method not implemented.');
  }
  override get injector(): Injector {
    throw new Error('Method not implemented.');
  }
  override get parentInjector(): Injector {
    throw new Error('Method not implemented.');
  }
  override get(index: number): ViewRef | null {
    throw new Error('Method not implemented.');
  }
  override get length(): number {
    throw new Error('Method not implemented.');
  }
  override insert(viewRef: ViewRef, index?: number): ViewRef {
    throw new Error('Method not implemented.');
  }
  override move(viewRef: ViewRef, currentIndex: number): ViewRef {
    throw new Error('Method not implemented.');
  }
  override indexOf(viewRef: ViewRef): number {
    throw new Error('Method not implemented.');
  }
  override remove(index?: number): void {
    throw new Error('Method not implemented.');
  }
  override detach(index?: number): ViewRef | null {
    throw new Error('Method not implemented.');
  }
  clear = jest.fn();
  createEmbeddedView = jest.fn().mockReturnValue({ rootNodes: [] });
  createComponent = jest.fn().mockReturnValue({
    instance: {
      close: jest.fn()
    }
  } as unknown as ComponentRef<ModalComponent>);
}

@Injectable({
  providedIn: 'root'
})
class TestModalService extends ModalService {
  constructor() {
    super(new MockEnvironmentInjector() as unknown as EnvironmentInjector);
  }
}

describe('ModalService', () => {
  let service: ModalService;
  let viewContainerRef: MockViewContainerRef;
  let templateRef: TemplateRef<Element>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalService);
    service = TestBed.inject(ModalService);
    viewContainerRef = new MockViewContainerRef();
    templateRef = {} as TemplateRef<Element>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debe abrir con el template', () => {
    service.open(viewContainerRef, templateRef);

    expect(viewContainerRef.clear).toHaveBeenCalled();
    expect(viewContainerRef.createEmbeddedView).toHaveBeenCalledWith(templateRef);
    expect(viewContainerRef.createComponent).toHaveBeenCalledWith(ModalComponent, {
      environmentInjector: service['injector'],
      projectableNodes: [[]],
    });
    expect(service.newModalComponent).toBeDefined();
  });

  it('debe setear las opciones del modal cuando va a abrirse', () => {
    const options = { size: { width: '300px' } };

    service.open(viewContainerRef, templateRef, options);

    expect(service.options).toEqual(options);
  });

  it('debe cerrar el modal', () => {
    const mockClose = jest.fn();
    service.newModalComponent = {
      instance: { close: mockClose }
    } as unknown as ComponentRef<ModalComponent>;

    service.close();

    expect(mockClose).toHaveBeenCalled();
  });
});
