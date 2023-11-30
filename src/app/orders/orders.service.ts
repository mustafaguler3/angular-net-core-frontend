import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order, OrderItem } from '../shared/models/order';
import { ReplaySubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  baseUrl = "http://localhost:5182/api/"

  private orderSource = new ReplaySubject<Order | null>(null)
  orderSource$ = this.orderSource.asObservable();

  private orderItemSource = new ReplaySubject<OrderItem | null>(null)
  orderItemSource$ = this.orderItemSource.asObservable();

  constructor(private http: HttpClient) { }

  getOrdersForUser(){
    return this.http.get<Order[]>(this.baseUrl + "orders");
  }

  getOrderDetailed(id: number){
    return this.http.get<Order>(this.baseUrl + "orders/"+id);
  }
}
