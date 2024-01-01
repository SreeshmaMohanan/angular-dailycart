import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  wishlistCount:Number=0
  cartCount:Number=0
  constructor(private router:Router,private api:ApiService){}
  loginUsername:string=""
  ngOnInit(): void {
    if(sessionStorage.getItem("username")){
      this.loginUsername = sessionStorage.getItem("username")?.split(" ")[0]|| ""
      this.api.wishlistCount.subscribe((res:any )=>{
        console.log(res);
        
        this.wishlistCount = res
         })
   this.api.cartCount.subscribe((res:any)=>{
    console.log(res);
    
    this.cartCount = res;
         })

    }else{
      this.loginUsername=""
      
    }
  }
  logout(){
   
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('username')
    this.wishlistCount=0
    this.router.navigateByUrl('/')
 }

}
