import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Books } from './models/books';

@Injectable({
  providedIn: 'root'
})
export class ProxyService {
  private url: string;
  private bookEdited: Books;

  constructor(private http: HttpClient) {
    this.url = "http://localhost:3000/books";
  }

  public readBooks = () =>{
    return this.http.get<Books[]>(this.url);
  }

  public addBook = (item: Books) =>{
    return this.http.post(this.url, item);
  }

  public updateBook = (id: number, item: Books) =>{
    return this.http.put(this.url + "/" + id, item);
  }

  public deleteBook = (id: number) =>{
    return this.http.delete(this.url + "/" + id);
  }

  public setBookEdited = (item: Books) =>{
    this.bookEdited = item;
  }

  public getBookEdited = () =>{
    return this.bookEdited;
  }
}
