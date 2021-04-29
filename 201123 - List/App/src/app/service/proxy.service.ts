import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListItem, ListResponse } from 'src/models/list';

@Injectable({
  providedIn: 'root'
})
export class ProxyService {
  private _url: string; 

  constructor(private http: HttpClient)
  {
    this._url = 'http://localhost:3000/api/';
  }

  public getAllItems = () =>{
    return this.http.get<ListResponse>(this._url + 'lists/');
  }

  public addItem = (item: ListItem) =>{
    return this.http.post(this._url + 'insert/', item);
  }

  public setItem = (item: ListItem) =>{
    return this.http.put(this._url + 'modify/' + item._id, item);
  }

  public deleteItem = (id: string) =>{
    return this.http.delete(this._url + 'delete/' + id);
  }
}
