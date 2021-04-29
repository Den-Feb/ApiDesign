import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { InsertPageComponent } from './insert-page/insert-page.component';
import { UpdatePageComponent } from './update-page/update-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'insert', component: InsertPageComponent },
  { path: 'update', component: UpdatePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
