import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  IPayPalConfig,
  ICreateOrderRequest 
} from 'ngx-paypal';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  public payPalConfig ? : IPayPalConfig;
  totalAmount:string=""
  procedToBuyStatus:boolean=false
  proceedtopaymentStatus:boolean=false
  checkoutForm = this.fb.group({
    uname:['',[Validators.required,Validators.pattern('[A-Za-z ]*')]],
    flat:['',[Validators.required,Validators.pattern('[A-Za-z0-9.:, ]*')]],
    place:['',[Validators.required,Validators.pattern('[A-Za-z., ]*')]],
    pincode:['',[Validators.required,Validators.pattern('[0-9]*')]]
  })
  constructor(private fb:FormBuilder,private toaster:ToastrService,private api:ApiService,private router:Router){}
  cancel(){
    this.checkoutForm.reset()
  }
  proceedToBuy(){
    if(this.checkoutForm.valid){
     
      this.procedToBuyStatus=true
      if(sessionStorage.getItem("total")){
        this.totalAmount=sessionStorage.getItem("total") ||""
           }
    }else{
      this.toaster.error("Please Fill All The Fields Correctly")

    }
  }
  back(){
    this.procedToBuyStatus=false
  }
proceedToPayment(){
  this.proceedtopaymentStatus=true
  this.initConfig()
}
 initConfig(): void {
  this.payPalConfig = {
      currency: 'USD',
      clientId: 'sb',
      createOrderOnClient: (data) => < ICreateOrderRequest > {
          intent: 'CAPTURE',
          purchase_units: [{
              amount: {
                  currency_code: 'USD',
                  value: this.totalAmount,
                  breakdown: {
                      item_total: {
                          currency_code: 'USD',
                          value: this.totalAmount
                      }
                  }
              },
             
          }]
      },
      advanced: {
          commit: 'true'
      },
      style: {
          label: 'paypal',
          layout: 'vertical'
      },
      onApprove: (data, actions) => {
          console.log('onApprove - transaction was approved, but not authorized', data, actions);
          actions.order.get().then((details:any) => {
              console.log('onApprove - you can get full order details inside onApprove: ', details);
          });

      },
      onClientAuthorization: (data) => {
          console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
          this.api.emptyCartAPI().subscribe((res:any)=>{
            this.api.getCartCount()
            this.toaster.success("Successfully Completed Payament... ThankYou for ordering with us!!!")
            this.procedToBuyStatus=false
            this.proceedtopaymentStatus=false
            this.checkoutForm.reset()
            this.router.navigateByUrl('/')
          })
      },
      onCancel: (data, actions) => {
          console.log('OnCancel', data, actions);
          this.toaster.warning("Transaction being canceled...")
          this.proceedtopaymentStatus=false

      },
      onError: err => {
          console.log('OnError', err);
          this.toaster.warning("Transaction Failed... please try after some time")
      },
      onClick: (data, actions) => {
          console.log('onClick', data, actions);
          
      }
  };
}
}

// https://learn.microsoft.com/en-us/training/modules/get-started-with-web-development/5-javascript-basics