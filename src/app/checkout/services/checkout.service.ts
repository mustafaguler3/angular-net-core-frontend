import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { DeliveryMethod } from 'src/app/shared/models/deliveryMethod';
import { Order, OrderToCreate } from 'src/app/shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  baseUrl = "http://localhost:5182/api/"

  constructor(private http: HttpClient) { }

  createOrder(order: OrderToCreate){
    return this.http.post<Order>(this.baseUrl + "orders",order);
  }

  getDeliveryMethods(){
    return this.http.get<DeliveryMethod[]>(this.baseUrl+"orders/deliveryMethods")
    .pipe(map(dm => {
      return dm.sort((a,b) => b.price - a.price)
    }))
  }
}
