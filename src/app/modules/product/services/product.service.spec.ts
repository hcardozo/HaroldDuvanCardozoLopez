import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { HttpApiResponse } from '../../shared/interfaces/http-api-response.interface';
import { Product } from '../interfaces/product.interface';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  const apiUrl = `${environment.API_URL}/products`;

  it('debe devolver los productos por el metodo GET', () => {
    const mockProducts: HttpApiResponse<Product[]> = {
      data: [
        { id: '1', name: 'Product 1', description: 'Description 1', logo: 'logo1.png', date_release: '2024-01-01', date_revision: '2025-01-01' },
        { id: '2', name: 'Product 2', description: 'Description 2', logo: 'logo2.png', date_release: '2024-02-01', date_revision: '2025-02-01' }
      ]
    };

    service.get().subscribe((response) => {
      expect(response).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('debe crear los registros por el metodo POST', () => {
    const newProduct: Product = { id: '3', name: 'Product 3', description: 'Description 3', logo: 'logo3.png', date_release: '2024-03-01', date_revision: '2025-03-01' };
    const mockResponse: HttpApiResponse<Product> = { data: newProduct };

    service.create(newProduct).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush(mockResponse);
  });

  it('debe actualizar los registros por el metodo PUT', () => {
    const updatedProduct: Product = { id: '1', name: 'Updated Product', description: 'Updated Description', logo: 'updated_logo.png', date_release: '2024-01-01', date_revision: '2025-01-01' };
    const mockResponse: HttpApiResponse<Product> = { data: updatedProduct };

    service.update('1', updatedProduct).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedProduct);
    req.flush(mockResponse);
  });

  it('debe eliminar los registros por el metodo DELETE', () => {
    const mockResponse: HttpApiResponse<any> = { data: null };

    service.delete('1').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('debe validar el id del producto por el metodo GET', () => {
    const mockValidationResponse = true;

    service.validate('1').subscribe((response) => {
      expect(response).toBe(mockValidationResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/verification/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockValidationResponse);
  });
});