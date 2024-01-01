import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit{
  allProducts:any=[]
  constructor(private api:ApiService,private toaster:ToastrService){}
  ngOnInit(): void {
    this.getWishlist()
    
  }
  getWishlist(){
    this.api.getWishlistAPI().subscribe((res:any)=>{
      this.allProducts=res
      this.api.getWishlistCount()

    })
  }
  removeItem(id:any){
    this.api.removeFromWishlistAPI(id).subscribe({
      next:(res:any) => {
        this.getWishlist()
      },
      error:(err:any)=>{
        console.log("Error", err);
      }
    })

  }
  addtoCart(product:any){
    if(sessionStorage.getItem("token")){
      Object.assign(product,{quantity:1})
      this.api.addtoCartAPI(product).subscribe({
        next:(res:any)=>{
          this.toaster.success(res)
          this.api.getCartCount()
          this.removeItem(product._id)
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
