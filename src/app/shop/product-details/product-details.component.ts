import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, take } from 'rxjs';
import { BasketService } from 'src/app/basket/services/basket.service';
import { ShopService } from 'src/app/services/shop.service';
import { Product } from 'src/app/shared/models/product';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit{

  product: Product;
  quantiy = 1;
  quantityInBasket = 0;

  constructor(private shopService: ShopService,
              private activatedRoute: ActivatedRoute,
              private bcService: BreadcrumbService,
              private basketService:BasketService){
                this.bcService.set("@productDetails","")
              }
  
  ngOnInit(): void {
    this.getProduct();
  }
  getProduct(){
    const id = +this.activatedRoute.snapshot.params["id"]
    if(id){
      this.shopService.getProduct(id).subscribe({
        next: product => {
          this.product = product;
          this.bcService.set('@productDetails',product.name);
          this.basketService.basketSource$.pipe(take(1)).subscribe({
            next: basket => {
              const item = basket?.items.find(x => x.id === id);

              if(item){
                this.quantiy = item.quantity;
                this.quantityInBasket = item.quantity;
              }
            }
          })
        }
      })
    }
  }


  incrementQuantity(){
    this.quantiy++;
  }

  decrementQuantity(){
    this.quantiy--;
  }

  updateBasket(){
    if(this.product){
      if(this.quantiy > this.quantityInBasket){
        const itemsToAdd = this.quantiy - this.quantityInBasket;
        this.quantityInBasket += itemsToAdd;
        this.basketService.addItemToBasket(this.product,itemsToAdd);
      }else {
        const itemsToRemove = this.quantityInBasket - this.quantiy  
        this.quantityInBasket -= itemsToRemove;
        this.basketService.removeItemFromBasket(this.product.id,itemsToRemove);
      }
    }
  }

  get buttonText(){
    return this.quantityInBasket === 0 ? "Add to basket" : "Update basket"
  }
}
