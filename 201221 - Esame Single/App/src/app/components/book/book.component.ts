import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Books } from 'src/app/models/books';
import { ProxyService } from 'src/app/proxy.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  @Input()
  public book: Books;

  constructor(private proxy: ProxyService,
    private router: Router) { }

  ngOnInit(): void {
  }

  modifyBook = () =>{
    this.proxy.setBookEdited(this.book);
    this.router.navigate(['update']);
  }

  deleteBook = () =>{
    this.proxy.deleteBook(this.book.id).subscribe( _=>{
      this.router.navigate(['']);
    });
  }
}
