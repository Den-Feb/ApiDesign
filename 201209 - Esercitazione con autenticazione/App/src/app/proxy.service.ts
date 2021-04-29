import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe, ResponseWrapper } from './models/recipe';
import { TokenReply } from './models/tokenReply';
import { TokenRequest } from './models/tokenRequest';

@Injectable({
  providedIn: 'root'
})
export class ProxyService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = "http://127.0.0.1:3000";
  }

  public autentication = (request: TokenRequest) =>{
    return this.http.post<TokenReply>(this.url + "/api/token", request);
  }

  public getAllRecpes = () =>{
    return this.http.get<ResponseWrapper<Recipe[]>>(this.url + "/api/recipes");
  }

  public getSpecificRecpipe = (element: string, typeSearch: string) =>{
    if(typeSearch == "Id"){
      return this.http.get<ResponseWrapper<Recipe[]>>(this.url + "/api/recipes/" + element);
    }
    return this.http.get<ResponseWrapper<Recipe[]>>(this.url + "/api/recipes?author=" + element);
  }
}
