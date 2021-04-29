import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Basket } from 'src/models/basket';
import { Product } from 'src/models/product';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @Input()
  public product: Product;

  @Output()
  public eSetBasket= new EventEmitter<Basket>();

  public basket: Basket = new Basket();

  constructor() { }

  ngOnInit(): void {
    this.basket.idProduct = this.product._id;
    this.basket.quantity = 0;
  }

  setQuantity(type: boolean): void {
    if(type == true){
      this.basket.quantity++;
    }else if(this.basket.quantity>0){
      this.basket.quantity--;
    }
  }

  confirmProduct(): void{
    this.eSetBasket.emit(this.basket);
    this.basket.quantity = 0;
  }
}
