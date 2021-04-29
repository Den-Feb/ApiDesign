import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { ProxyService } from 'src/app/proxy.service';
import { Basket } from 'src/models/basket';
import { BasketDisplayed } from 'src/models/basketDisplayed';
import { Product } from 'src/models/product';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {
  @Input()
  public newBasket: Basket;

  @Input()
  public products: Product[];

  public baskets: Basket[] = [];
  public basketDisplayed: BasketDisplayed[] = [];

  constructor(private proxy: ProxyService) { }

  ngOnInit(): void {
    this.getAllProdIntoBasket();
  }

  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    this.getAllProdIntoBasket();
  }

  getAllProdIntoBasket(): void {
    this.proxy.getBaskets().subscribe(items => {
      this.baskets = items.items;

      for (let x = 0; x < this.baskets.length; x++) {
        const basket = this.baskets[x];
        const product: Product= <Product>this.products.find(item => item._id == basket.idProduct);
        this.basketDisplayed[x] = new BasketDisplayed;

        this.basketDisplayed[x].productName = product.nome;
        this.basketDisplayed[x].price = product.prezzo;
        this.basketDisplayed[x].quantity = basket.quantity;
      }
    });
  }
}
