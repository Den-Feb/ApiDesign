import { Component, OnInit } from '@angular/core';
import { Recipe, ResponseWrapper } from '../models/recipe';
import { ProxyService } from '../proxy.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  public recipes: Recipe[];
  public messageRequested = new ResponseWrapper();
  public selectedOption: string;
  public selectedOptionType: string;

  constructor(private proxy: ProxyService)
  { 
    this.recipes = [];
    this.selectedOptionType = "";
  }

  ngOnInit(): void {
    this.getAllRecpies();
  }

  public getAllRecpies = () =>{
    this.proxy.getAllRecpes().subscribe(items =>{
      this.messageRequested = items;
      this.recipes = <Recipe[]>this.messageRequested.datas;
    })
  }

  public getOneRecipe = () =>{
    this.messageRequested = new ResponseWrapper();
    console.log("Id: "+this.selectedOption+" get: "+this.selectedOptionType);
    this.proxy.getSpecificRecpipe(this.selectedOption, this.selectedOptionType).subscribe(items =>{
      this.messageRequested = items;
      console.log("status: " + this.messageRequested.message);
      console.log("data: " + this.messageRequested.data);
      console.log("datas: " + this.messageRequested.datas);
      this.recipes = <Recipe[]>this.messageRequested.datas;
      console.log("Recipe: " + this.recipes[0].author);
    });
  }
}
