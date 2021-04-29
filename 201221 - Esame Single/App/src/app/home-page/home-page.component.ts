import { Component, OnInit } from '@angular/core';
import { Books } from '../models/books';
import { ProxyService } from '../proxy.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  public books: Books[];

  constructor(private proxy: ProxyService) {
    this.books = [];
  }

  ngOnInit(): void {
    this.getBooks();
  }

  public getBooks = () =>{
    this.proxy.readBooks().subscribe(items =>{
      this.books= items;
    });
  }
}
