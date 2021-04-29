import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Books } from '../models/books';
import { ProxyService } from '../proxy.service';

@Component({
  selector: 'app-insert-page',
  templateUrl: './insert-page.component.html',
  styleUrls: ['./insert-page.component.css']
})
export class InsertPageComponent implements OnInit {
  public newBook: Books;

  constructor(private proxy: ProxyService,
    private router: Router) {
    this.newBook= new Books();
  }

  ngOnInit(): void {
  }

  insertBooks = () =>{
    this.proxy.addBook(this.newBook).subscribe( _=>{
      this.router.navigate(['']);
    });
  }
}
