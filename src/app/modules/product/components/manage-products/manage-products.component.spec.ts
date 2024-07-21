import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProductsComponent } from './manage-products.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductService } from '../../services/product.service';
import { SharedModule } from '../../../shared/shared.module';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../shared/services/alert.service';
import { Router } from '@angular/router';
import { Product } from '../../interfaces/product.interface';
import { of } from 'rxjs';


describe('ManageProductsComponent', () => {
  let component: ManageProductsComponent;
  let fixture: ComponentFixture<ManageProductsComponent>;
  let productService: jest.Mocked<ProductService>;
  let alertService: jest.Mocked<AlertService>;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {
    productService = {
      create: jest.fn(),
      update: jest.fn(),
      validate: jest.fn()
    } as any;

    alertService = {
      showAlert: jest.fn()
    } as any;

    router = {
      navigate: jest.fn(),
      getCurrentNavigation: jest.fn().mockReturnValue({ extras: { state: { data: null } } })
    } as any;

    await TestBed.configureTestingModule({
      declarations: [ManageProductsComponent],
      providers: [
        { provide: ProductService, useValue: productService },
        { provide: AlertService, useValue: alertService },
        { provide: Router, useValue: router },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        SharedModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageProductsComponent);
    component = fixture.componentInstance;
  });

  // Test for component initialization and form setup
  it('debe crear el componente e inicializar el formulario', () => {
    expect(component).toBeTruthy();
    expect(component.productForm instanceof FormGroup).toBe(true);
  });

  it('debe inicializar errorList en la creacion', () => {
    expect(component.errorList.has('required')).toBe(true);
    expect(component.errorList.get('required')).toBe('Este campo es requerido!');
  });

  it('debe llamar configFormToEdit cuando el router State tiene datos', () => {
    const mockProduct: Product = {
      id: '123',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'logo.png',
      date_release: '2024-01-01',
      date_revision: '2025-01-01'
    };

    router.getCurrentNavigation = jest.fn().mockReturnValue({ extras: { state: { data: mockProduct } } });
    const spy = jest.spyOn(component, 'configFormToEdit');

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalledWith(mockProduct);
    })
  });

  it('debe setear revisionDate cuando releaseDate cambia', () => {
    const releaseDateControl = component.productForm.get('releaseDate');
    releaseDateControl?.setValue('2024-01-01');

    expect(component.productForm.get('revisionDate')?.value).toBe('2025-01-01');
  });

  it('debe llamar productService.update y navegar en el metodo onSave cuando el id es disable', () => {
    component.productForm.get('id')?.disable();
    component.productForm.setValue({
      id: '123',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'logo.png',
      releaseDate: '2024-01-01',
      revisionDate: '2025-01-01'
    });

    productService.update.mockReturnValue(of({}));
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.onSave();

    expect(productService.update).toHaveBeenCalledWith('123', {
      id: '123',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'logo.png',
      date_release: '2024-01-01',
      date_revision: '2025-01-01'
    });
    expect(alertService.showAlert).toHaveBeenCalledWith('success', 'Producto actualizado !');
    expect(navigateSpy).toHaveBeenCalledWith(['./products/list']);
  });

  it('debe resetear el formulario y habilitar el campo id cuando hace reset', () => {
    component.productForm.get('id')?.disable();
    component.onReset();

    expect(component.productForm.get('id')?.enabled).toBe(true);
    expect({
      id: component.productForm.get('id')?.value,
      name: component.productForm.get('name')?.value,
      description: component.productForm.get('description')?.value,
      logo: component.productForm.get('logo')?.value,
      releaseDate: component.productForm.get('releaseDate')?.value,
      revisionDate: component.productForm.get('revisionDate')?.value
    }).toEqual({
      id: null,
      name: null,
      description: null,
      logo: null,
      releaseDate: null,
      revisionDate: null
    });
  });

  it('debe validar que el product id sea unico', () => {
    productService.validate.mockReturnValue(of(true));

    const control = component.productForm.get('id');
    control?.setValue('exist-id');

    control?.updateValueAndValidity();

    expect(control?.errors).toEqual({ idExist: true });
  });
});