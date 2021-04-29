import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Basket, BasketResponse } from 'src/models/basket';
import { ProductResponse } from 'src/models/product';

@Injectable({
  providedIn: 'root'
})
export class ProxyService {
  private _url: string;

  constructor(private http: HttpClient) 
  {
    this._url = "http://127.0.0.1:3000/api/";
  }

  public getAllProducts = () =>{
    return this.http.get<ProductResponse>(this._url + "products");
  }

  public getBaskets = () =>{
    return this.http.get<BasketResponse>(this._url + "baskets");
  }

  public insertProductIntoBasket = (basket: Basket) =>{
    return this.http.post(this._url + "baskets", basket);
  }
}
