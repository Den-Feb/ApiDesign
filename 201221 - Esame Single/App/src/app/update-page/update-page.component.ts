import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Books } from '../models/books';
import { ProxyService } from '../proxy.service';

@Component({
  selector: 'app-update-page',
  templateUrl: './update-page.component.html',
  styleUrls: ['./update-page.component.css']
})
export class UpdatePageComponent implements OnInit {
  public book: Books= new Books();

  constructor(private proxy: ProxyService,
    private router: Router) { }

  ngOnInit(): void {
    this.getBook();
  }

  public getBook = () =>{
    this.book = this.proxy.getBookEdited();
  }

  public modifyBook = () =>{
    this.proxy.updateBook(this.book.id, this.book).subscribe( _=>{
      this.router.navigate(['']);
    });
  }

}
