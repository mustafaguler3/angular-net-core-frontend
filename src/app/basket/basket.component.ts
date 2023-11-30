import { Component, OnInit } from '@angular/core';
import { BasketService } from './services/basket.service';
import { Basket, BasketItem } from '../shared/models/basket';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent {

  constructor(public basketService: BasketService){}

  incrementQuantity(item: BasketItem){
    this.basketService.addItemToBasket(item)
  }

  decrementQuantity(event:{id: number,quantity: number}){
    this.basketService.removeItemFromBasket(event.id,event.quantity)
  }

}
