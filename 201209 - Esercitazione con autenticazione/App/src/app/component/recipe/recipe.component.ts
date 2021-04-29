import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from 'src/app/models/recipe';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {
  @Input()
  public recipes: Recipe;

  constructor() { }

  ngOnInit(): void {
  }

}
