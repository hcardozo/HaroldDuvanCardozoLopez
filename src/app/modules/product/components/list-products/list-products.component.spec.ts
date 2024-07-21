import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProductsComponent } from './list-products.component';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { GenericInputComponent } from '../../../shared/components/generic-input/generic-input.component';
import { Router } from '@angular/router';
import { ModalService } from '../../../shared/services/modal.service';
import { AlertService } from '../../../shared/services/alert.service';
import { inject, TemplateRef, ViewContainerRef, ViewRef } from '@angular/core';
import { of } from 'rxjs';
import { AlertType } from '../../../shared/enums/alert-enum';
import { Product } from '../../interfaces/product.interface';

class MockProductService {
  get() {
    return of({ data: [{ id: 1, name: 'Product 1', description: 'Desc 1', date_release: '2023-01-01', date_revision: '2023-01-02' }] });
  }
}
class MockModalService {
  open = jest.fn();
  close = jest.fn();
}

class MockViewContainerRef extends ViewContainerRef {
  override get(index: number): ViewRef | null {
    throw new Error('Method not implemented.');
  }
  clear() { }
  get element() {
    return {} as any;
  }
  get injector() {
    return {} as any;
  }
  get parentInjector() {
    return {} as any;
  }
  get length() {
    return 0;
  }
  createEmbeddedView() {
    return {} as any;
  }
  createComponent() {
    return {} as any;
  }
  insert() {
    return {} as any;
  }
  move() {
    return {} as any;
  }
  indexOf() {
    return -1;
  }
  remove() { }
  detach() {
    return {} as any;
  }
}


describe('ListProductsComponent', () => {
  let component: ListProductsComponent;
  let fixture: ComponentFixture<ListProductsComponent>;
  let productService: ProductService;
  let router: Router;
  let modalService: ModalService;
  let alertService: AlertService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListProductsComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        SharedModule
      ],
      providers: [
        { provide: ProductService, useClass: MockProductService },
        { provide: ModalService, useClass: MockModalService },
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: NG_VALUE_ACCESSOR,
          multi: true,
          useExisting: GenericInputComponent,
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListProductsComponent);
    component = fixture.componentInstance;
    component.products = [{ id: '1', name: 'Product 1', description: 'Desc 1', date_release: '2023-01-01', date_revision: '2023-01-02', logo: 'logo' }]
    productService = TestBed.inject(ProductService);
    router = TestBed.inject(Router);
    modalService = TestBed.inject(ModalService);
    alertService = TestBed.inject(AlertService);
    fixture.detectChanges();
  });

  it('debe setear productToShow cuando exista value', () => {
    const value = 5;
    const el = fixture.nativeElement.querySelector('select');
    el.value = value;
    el.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.productToShow).toEqual(component.products.slice(0, +value));
    });
  });

  it('debe llamar filterProductsByString cuando rowsPerPageFormControl y searchFormControl tengan un valor', () => {
    const value = '2';
    const searchValue = 'test';
    component.searchFormControl.setValue(searchValue);
    component.filterProductsByString = jest.fn();

    component.rowsPerPageFormControl.setValue(value);

    expect(component.filterProductsByString).toHaveBeenCalledWith(searchValue);
  });

  it('no debe llamar filterProductsByString cuando searchFormControl no tenga valor', () => {
    const value = '2';
    component.searchFormControl.setValue('');
    component.filterProductsByString = jest.fn();

    component.rowsPerPageFormControl.setValue(value);

    expect(component.filterProductsByString).not.toHaveBeenCalled();
  });

  it('no debe setear productToShow cuando rowsPerPageFormControl no tenga valor', () => {
    const value = null;
    component.rowsPerPageFormControl.setValue(value);
    expect(component.productToShow).toEqual(component.products);
  });

  it('debe setear los valores al iniciar componente onInit', () => {
    component.ngOnInit();
    expect(component.products.length).toBe(1);
    expect(component.productToShow.length).toBe(1);
  });

  it('debe filtrar correctamente los productos', () => {
    const searchValue = 'Product 1';
    component.searchFormControl.setValue(searchValue);
    component.filterProductsByString(searchValue);
    expect(component.productToShow.length).toBe(1);
  });

  it('debe redirigir correctamente', () => {
    const route = '/products/register';
    const data = { id: 1 };
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.redirect(route, data);
    expect(navigateSpy).toHaveBeenCalledWith([route], { state: { data } });
  });

  it('debe abrir modal con template correctamente', () => {
    const view = {} as TemplateRef<Element>;
    const vcr = {} as ViewContainerRef;
    component.vcr = vcr; // Asegurarse de que vcr esté configurado

    component.openModalTemplate(view);

    expect(modalService.open).toHaveBeenCalledWith(vcr, view, {
      size: {
        width: '25rem',
      },
    });
  });

  it('debe cerrar modal correctamente', () => {
    component.closeModal();
    expect(component.productToDelete).toBeNull();
    expect(modalService.close).toHaveBeenCalled();
  });

  it('debe setear productToDelete y llamar a openModalTemplate', () => {
    const product = component.products[0];
    const templateRef = {} as TemplateRef<Element>;

    // Spy on openModalTemplate to check if it is called
    jest.spyOn(component, 'openModalTemplate');

    component.showModalEditRow(product, templateRef);

    expect(component.productToDelete).toBe(product);
    expect(component.openModalTemplate).toHaveBeenCalledWith(templateRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
