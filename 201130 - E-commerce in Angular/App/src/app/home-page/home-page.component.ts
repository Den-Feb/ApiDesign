import { Component, OnInit } from '@angular/core';
import { Basket } from 'src/models/basket';
import { Product } from 'src/models/product';
import { ProxyService } from '../proxy.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  public productsItems: Product[] = [];
  public newBasket: Basket= new Basket();

  constructor(private proxy: ProxyService) { }

  ngOnInit(): void {
    this.getAllItems();
  }

  getAllItems(): void{
    this.proxy.getAllProducts().subscribe(items =>{
      this.productsItems = items.items;
    });
  }

  setNewItem(basket: Basket): void{
    this.newBasket = basket;
    this.proxy.insertProductIntoBasket(basket).subscribe(_=>{});
  }
}
