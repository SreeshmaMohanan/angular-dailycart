import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{ 
  cartItems:any={} 
  cartTotalPrice:number=0
  constructor(private api:ApiService,private router:Router){}
ngOnInit(): void {
  if(sessionStorage.getItem("token")){
    this.getCart()

  }else{
    this.cartItems=[]
  }
}
getCart(){
  this.api.getCartAPI().subscribe((res:any)=>{
    this.cartItems=res
    this.getCartTotalPrice()
  })
}
getCartTotalPrice(){
  if(this.cartItems.length>0){
    let total=0
    this.cartItems.forEach((product:any)=>{
      total+=product.grandTotal

    })
     this.cartTotalPrice = Math.ceil(total);

  }else{
    this.cartTotalPrice=0
  }
}
//increment

incrementCart(id:any){
this.api.cartIncAPI(id).subscribe({
  next:(res:any)=>{
    this.getCart()
    this.api.getCartCount()
  },
  error:(err:any)=>{
    console.log(err.error)
  }
})
}

//decrement
decrementCart(id:any){
  this.api.cartDecAPI(id).subscribe({
    next:(res:any)=>{
      this.getCart()
      this.api.getCartCount()
    },
    error:(err:any)=>{
      console.log(err.error)
    }
  })
  }
  //delete a cart item
  removeItem(id:any){
    this.api.removefromCartAPI(id).subscribe((res:any)=>{
      this.getCart()
      this.api.getCartCount()
    })

  }
  //emptycart
  emptyCart(){
    this.api.emptyCartAPI().subscribe((res:any)=>{
      this.getCart()
      this.api.getCartCount()
      location.reload()
    })
  }
  checkout(){
    sessionStorage.setItem("total",JSON.stringify(this.cartTotalPrice))
    this.router.navigateByUrl('/user/checkout')
  }
}
