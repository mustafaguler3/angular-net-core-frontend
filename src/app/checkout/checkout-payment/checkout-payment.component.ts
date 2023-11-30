import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasketService } from 'src/app/basket/services/basket.service';
import { CheckoutService } from '../services/checkout.service';
import { ToastrService } from 'ngx-toastr';
import { Basket } from '../../shared/models/basket';
import { Address } from 'src/app/shared/models/user';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent {
  @Input() checkoutForm?: FormGroup;

  constructor(private basketService: BasketService,
              private checkoutService: CheckoutService,
              private toastrService: ToastrService,
              private router: Router){}

  submitOrder(){
    
    const basket = this.basketService.getCurrentBasketValue();
    if(!basket) return;
    const orderToCreate = this.getOrderToCreate(basket);
    if(!orderToCreate) return;
    
    this.checkoutService.createOrder(orderToCreate).subscribe({
      next: order => {
        this.toastrService.success("Order created successfully");
        this.basketService.deleteLocalBasket();
        const navigationExtras: NavigationExtras = {state: order};
        this.router.navigate(["checkout/success"],navigationExtras)
      },error: err => console.log(err)
    })
  }
        
  private getOrderToCreate(basket: Basket){
    const deliveryMethodId = this.checkoutForm?.get('deliveryForm')?.get('deliveryMethod').value;
    const shipToAddress = this.checkoutForm?.get('addressForm')?.value as Address;
    if(!deliveryMethodId || !shipToAddress) return;
    return {
      basketId: basket.id,
      deliveryMethodId: deliveryMethodId,
      shipToAddress: shipToAddress
    }
  }
}
