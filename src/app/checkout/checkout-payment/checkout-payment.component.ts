import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasketService } from 'src/app/basket/services/basket.service';
import { CheckoutService } from '../services/checkout.service';
import { ToastrService } from 'ngx-toastr';
import { Basket } from '../../shared/models/basket';
import { Address } from 'src/app/shared/models/user';
import { NavigationExtras, Router } from '@angular/router';
import {
  Stripe,
  StripeCardCvcElement,
  StripeCardExpiryElement,
  StripeCardNumberElement,
  loadStripe,
} from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss'],
})
export class CheckoutPaymentComponent implements OnInit {
  @Input() checkoutForm?: FormGroup;
  @ViewChild('cardNumber') cardNumberElement?: ElementRef;
  @ViewChild('cardExpiry') cardNumberExpiry?: ElementRef;
  @ViewChild('cardCvc') cardNumberCvc?: ElementRef;
  stripe: Stripe | null = null;
  cardNumber?: StripeCardNumberElement;
  cardExpiry?: StripeCardExpiryElement;
  cardCvc?: StripeCardCvcElement;
  cardError: any;
  loading = false;

  constructor(
    private basketService: BasketService,
    private checkoutService: CheckoutService,
    private toastrService: ToastrService,
    private router: Router
  ) {}
  ngOnInit(): void {
    loadStripe(
      'pk_test_51LIGm5BJk0ZaKsmdyq1YUjfgcwEADWfhWcNTIMKWIv8LFk5XTq7its8TPtXRqWI2qXRJdyHUIAV4IMXUCqlwMDxU00xHqpGRcD'
    ).then((stripe) => {
      this.stripe = stripe;
      const elements = stripe?.elements();

      if (elements) {
        this.cardNumber = elements.create('cardNumber');
        this.cardNumber.mount(this.cardNumberElement?.nativeElement);
        this.cardNumber.on('change', (event) => {
          if (event.error) this.cardError = event.error.message;
          else this.cardError = null;
        });

        this.cardExpiry = elements.create('cardExpiry');
        this.cardExpiry.mount(this.cardNumberExpiry?.nativeElement);
        this.cardExpiry.on('change', (event) => {
          if (event.error) this.cardError = event.error.message;
          else this.cardError = null;
        });

        this.cardCvc = elements.create('cardCvc');
        this.cardCvc.mount(this.cardNumberCvc?.nativeElement);
        this.cardCvc.on('change', (event) => {
          if (event.error) this.cardError = event.error.message;
          else this.cardError = null;
        });
      }
    });
  }

  async submitOrder() {
    this.loading = true;
    const basket = this.basketService.getCurrentBasketValue();
    try {
      const createdOrder = await this.createOrder(basket);
      const paymentResult = await this.confirmPaymentWithStripe(basket);

      if(paymentResult.paymentIntent){
        this.basketService.deleteLocalBasket();
        const navigationExtras: NavigationExtras = { state: createdOrder };
        this.router.navigate(['checkout/success'], navigationExtras);
      }else {
        this.toastrService.error(paymentResult.error.message)
      }
    }catch(error: any){
      this.toastrService.error(error.message)
    }finally {
      this.loading = false;
    }
  }

  private async confirmPaymentWithStripe(basket: Basket | null) {
    if (!basket) throw new Error('Basket is null');
    const result = this.stripe?.confirmCardPayment(basket.clientSecret!, {
      payment_method: {
        card: this.cardNumber!,
        billing_details: {
          name: this.checkoutForm?.get('paymentForm')?.get('nameOnCard')?.value
        }
      },
    });

    if(!result) throw new Error('Problem attempting payment with stripe')

    return result
  }

  private createOrder(basket: Basket | null) {
    if (!basket) throw new Error('Basket is null');
    const orderToCreate = this.getOrderToCreate(basket);
    return firstValueFrom(this.checkoutService.createOrder(orderToCreate));
  }

  private getOrderToCreate(basket: Basket) {
    // put : OrderToCreate for return if you get error
    const deliveryMethodId = this.checkoutForm
      ?.get('deliveryForm')
      ?.get('deliveryMethod').value;
    const shipToAddress = this.checkoutForm?.get('addressForm')
      ?.value as Address;
    if (!deliveryMethodId || !shipToAddress) return;
    return {
      basketId: basket.id,
      deliveryMethodId: deliveryMethodId,
      shipToAddress: shipToAddress,
    };
  }
}
