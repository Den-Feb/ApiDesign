import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ListPageComponent } from './list-page/list-page.component';
import { InsertPageComponent } from './insert-page/insert-page.component';
import { TitleComponentComponent } from './components/title-component/title-component.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ListPageComponent,
    InsertPageComponent,
    TitleComponentComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
