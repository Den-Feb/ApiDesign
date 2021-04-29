import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListItem } from 'src/models/list';
import { ProxyService } from '../service/proxy.service';

@Component({
  selector: 'app-insert-page',
  templateUrl: './insert-page.component.html',
  styleUrls: ['./insert-page.component.css']
})
export class InsertPageComponent implements OnInit {
  public item: ListItem = new ListItem();

  constructor(private proxy: ProxyService,
    private router: Router) { }

  ngOnInit(): void {
  }

  public sendItem = () =>{
    this.item.completed = false;
    this.item.creationDate = new Date();
    this.proxy.addItem(this.item).subscribe( _=>{
      this.router.navigate(['']);
    })
  }
}
