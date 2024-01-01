import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-products',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.css']
})
export class ViewProductsComponent implements OnInit{
  product:any={}
  constructor(private route:ActivatedRoute,private api:ApiService,private toaster:ToastrService) { }
  ngOnInit(): void {
    this.route.params.subscribe((res:any)=>{
      console.log(res);
      const {id}=res
      //get details of perticular item
      this.getProductDetails(id)
    })
    
  }
  getProductDetails(id:any){
    this.api.getProductAPI(id).subscribe({
      next:(res:any) => {
        this.product = res
        console.log(this.product);
        
      },
      error:(err:any)=>{
        console.log(err.error);
      }
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

