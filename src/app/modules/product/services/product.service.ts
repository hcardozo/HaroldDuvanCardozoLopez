import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpApiResponse } from '../../shared/interfaces/http-api-response.interface';
import { Product } from '../interfaces/product.interface';

@Injectable()
export class ProductService {

  private URL: string = `${environment.API_URL}/products`;

  public constructor(private httpClient: HttpClient) { }

  public get(): Observable<HttpApiResponse<Product[]>> {
    return this.httpClient.get<HttpApiResponse<Product[]>>(this.URL);
  }

  public create(product: Product): Observable<HttpApiResponse<Product>> {
    return this.httpClient.post<HttpApiResponse<Product>>(this.URL, product);
  }

  public update(id: string, product: Product): Observable<HttpApiResponse<Product>> {
    return this.httpClient.put<HttpApiResponse<Product>>(`${this.URL}/${id}`, product);
  }

  public delete(id: string): Observable<HttpApiResponse<Product>> {
    return this.httpClient.delete<HttpApiResponse<Product>>(`${this.URL}/${id}`);
  }

  public validate(id: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.URL}/verification/${id}`);
  }
}
