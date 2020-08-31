import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators'
import { map } from 'rxjs/operators';

import { Product } from './product';




@Injectable()
export class ProductService {
    private _productUrl = 'assets/products/mobiles.json';
    
    selectedProducts: any = [];
    products: any = [];
    producttype = 'tablet';
    username: string;
    constructor(private http: HttpClient) {
        if (sessionStorage.getItem('selectedProducts')) {
            
            this.selectedProducts = JSON.parse(sessionStorage.getItem('selectedProducts'));
            console.log("Selected Products",this.selectedProducts )
        }
    }

    getProducts(): Observable<Product[]> {
        
        if (this.producttype === 'tablet') {
            console.log("Tablets")
            return this.http.get<Product[]>('assets/products/tablets.json').pipe(
                catchError(this.handleError));
        } else if (this.producttype === 'mobile') {
            console.log("Mobiles")
            return this.http.get<Product[]>('assets/products/mobiles.json').pipe(
                catchError(this.handleError));
        }
    }

    getProduct(id: number): Observable<Product> {
        return this.getProducts().pipe(
            map(products => products.filter(product => product.productId === id)[0]));
    }

    private handleError(err: HttpErrorResponse) {
        console.log(err);
        return Observable.throw(err.error() || 'Server error');
    }
}
