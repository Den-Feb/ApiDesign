import { Component, OnInit } from '@angular/core';
import { ListItem } from 'src/models/list';
import { ProxyService } from '../service/proxy.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.css']
})
export class ListPageComponent implements OnInit {
  public items: ListItem[] = [];

  constructor(private proxy: ProxyService) { }

  ngOnInit(): void {
    this.getAllItems();
  }

  getAllItems = () => {
    this.proxy.getAllItems().subscribe(data => {
      this.items= data.items;
    });
  }

  public completed = (id: string) =>{
    console.log("component list: " + id);
    let item: ListItem = <ListItem>this.items.find(item => item._id = id);
    item.completed = true;
    item.completedDate = new Date();
    console.log("component: " + item._id);
    console.log("component: " + item.author);

    this.proxy.setItem(item).subscribe( _=>{
      this.getAllItems();
    });
  }

  public deleted = (id: string) =>{
    this.proxy.deleteItem(id).subscribe(_=>{
      this.getAllItems();
    });
  }
}
