import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { InsertPageComponent } from './insert-page/insert-page.component';
import { ListPageComponent } from './list-page/list-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'list', component: ListPageComponent },
  { path: 'insert', component: InsertPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
