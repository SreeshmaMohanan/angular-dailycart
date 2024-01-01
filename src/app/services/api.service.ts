import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
SERVER_URL="https://daily-cartserver.onrender.com"
wishlistCount = new BehaviorSubject(0)
cartCount= new BehaviorSubject(0)

  constructor(private http:HttpClient) {
    if(sessionStorage.getItem("token")){
      this.getWishlistCount()
      this.getCartCount()
    }
   }
  getAllProductsAPI(){
    return this.http.get(`${this.SERVER_URL}/products/all`)
  }
  //register
  registerAPI(user:any){
    return this.http.post(`${this.SERVER_URL}/user/register`, user);

  }
  //login
  loginAPI(user:any){
    return this.http.post(`${this.SERVER_URL}/user/login`, user);

  }
  //get product api
  getProductAPI(id:any){
    return this.http.get(`${this.SERVER_URL}/product/get/${id}`)
  }

  //append tokeen header
appendTokenToHeader(){
  let headers= new HttpHeaders()
  const token = sessionStorage.getItem("token")
  if(token){
    headers = headers.append("Authorization",`Bearer ${token}`)
  }
  return {headers}
}

  addToWishlistAPI(product:any){
    return this.http.post(`${this.SERVER_URL}/wishlist/add`,product,this.appendTokenToHeader());

  }
  // /wishlist/get-allproducts
  getWishlistAPI(){
    return this.http.get(`${this.SERVER_URL}/wishlist/get-allproducts`,this.appendTokenToHeader())
  }
  getWishlistCount(){
    this.getWishlistAPI().subscribe((res:any)=>{
      this.wishlistCount.next(res.length)
    })
  }
  // delete wishlist item api
  removeFromWishlistAPI(id:any){
    return this.http.delete(`${this.SERVER_URL}/wishlist/remove/${id}`,this.appendTokenToHeader())

  }
  //add to cart
  addtoCartAPI(product: any){
    return this.http.post(`${this.SERVER_URL}/cart/add`,product,this.appendTokenToHeader())
  }
  // get cart api
  getCartAPI(){
    return this.http.get(`${this.SERVER_URL}/cart/get-all-products`,this.appendTokenToHeader())
  }

  getCartCount(){
    this.getCartAPI().subscribe((res:any)=>{
      this.cartCount.next(res.length)
    })
  }
  //inc cart 
  cartIncAPI(id:any){
    return this.http.get(`${this.SERVER_URL}/cart/increment/${id}`,this.appendTokenToHeader())

  }
  //dec
  cartDecAPI(id:any){
    return this.http.get(`${this.SERVER_URL}/cart/decrement/${id}`,this.appendTokenToHeader())

  }
  //remove cartitem
  removefromCartAPI(id:any){
    return this.http.delete(`${this.SERVER_URL}/cart/remove/${id}`,this.appendTokenToHeader())
  }
  //empty cart
  emptyCartAPI(){
    return this.http.delete(`${this.SERVER_URL}/cart/empty`,this.appendTokenToHeader())
  }
  }