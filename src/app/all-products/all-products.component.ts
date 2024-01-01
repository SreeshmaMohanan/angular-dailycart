import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit{
 allProducts:any=[]
 constructor(private api:ApiService,private toaster:ToastrService) {}
 ngOnInit(): void {
   this.api.getAllProductsAPI().subscribe((res:any)=>{
    this.allProducts=res
   })
 }
 addtoWishlist(product:any){
  if(sessionStorage.getItem("token")){
    this.api.addToWishlistAPI(product).subscribe({
      next:(res:any)=>{
        this.toaster.success(`${res.title} added successfully`)
        this.api.getWishlistCount()
      },
      error:(err:any)=>{
        this.toaster.warning(err.error);
      }
    })
    
  }else{
    this.toaster.warning("Operation denied... Please login")
  }

 }
//  add to cart
 addtoCart(product:any){
  if(sessionStorage.getItem("token")){
    Object.assign(product,{quantity:1})
    this.api.addtoCartAPI(product).subscribe({
      next:(res:any)=>{
        this.toaster.success(res)
        this.api.getCartCount()
      },
      error:(err:any)=>{
        console.log(err)
        this.toaster.warning(err.error);
      }
    })
   
  }else{
    this.toaster.warning("Operation denied... Please login")
  }


 }
}
