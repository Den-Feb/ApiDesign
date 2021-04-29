import { Component, OnInit } from '@angular/core';
import { TokenRequest } from '../models/tokenRequest';
import { ProxyService } from '../proxy.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  public tokenRequest: TokenRequest = new TokenRequest();

  constructor(private proxy: ProxyService) { }

  ngOnInit(): void {
  }

  public autentication = () =>{
    this.proxy.autentication(this.tokenRequest).subscribe(item =>{
      
    });
  }
}
