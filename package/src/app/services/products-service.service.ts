import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Product, ProductCategory } from '../interfaces/ProductsInterfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductsServiceService {

  private path = environment.api;
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {  }

  getProductsList() {
    const url = this.path + '/Products';
    return this.http.get<Product[]>(url);
  }

  getProductsCategoriesList() {
    const url = this.path + '/ProductCategories';
    return this.http.get<ProductCategory[]>(url);
  }

  setProduct(userObject: Product) {
    const url = this.path + '/Products';

    return this.http.post(url, JSON.stringify(userObject), { headers: this.headers })
  }

  updateProduct(userObject: Product, userId: number) {
    const url = this.path + '/Products/' + userId;
    return this.http.put(url, JSON.stringify(userObject), { headers: this.headers });
  }

  deleteProduct(userId: number) {
    const url = this.path + '/Products/' + userId;
    return this.http.delete(url, { headers: this.headers });
  }
}
