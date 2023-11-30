import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ShopService } from '../services/shop.service';
import { Product } from '../shared/models/product';
import { Brand } from '../shared/models/brand';
import { Type } from '../shared/models/type';
import { ShopParams } from '../shared/models/shopparams';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit{

  @ViewChild('search') searchTerm?: ElementRef
  products: Product[] = [];
  brands: Brand[] = [];
  types: Type[] = [];
  shopParam = new ShopParams();
  totalCount = 0;
  
  sort  = ""
  sortOptions = [
    {name:"Alphabetical",value:"name"},
    {name:"Price: Low to High",value:"priceAsc"},
    {name:"Price: High to Low",value:"priceDesc"}
  ]

  constructor(private shopService: ShopService){}

  ngOnInit(): void {
      //this.getProducts();
      this.getProductsWithParams();
      this.getBrands();
      this.getTypes();
  }

  onPageChanged(event: any) {
    if(this.shopParam.pageNumber !== event){
      this.shopParam.pageNumber = event;
      this.getProductsWithParams()
    }
}

  getProducts(){
    this.shopService.getProductsNoParams().subscribe(
      response => {
        this.products = response
    },err => {
      console.log(err)
    })
  }

  getProductsWithParams(){
    this.shopService.getProductsWithParams(this.shopParam)
    .subscribe({
      next: response => {
        this.products = response?.data;
        this.shopParam.pageNumber = response?.pageIndex;
        this.shopParam.pageSize = response?.pageSize;
        this.totalCount = response?.count;
        this.shopParam.search = this.searchTerm.nativeElement?.value;
      }
    })
  }
  /*
response => {
      this.products = response?.data;
      this.shopParam.pageNumber = response?.pageIndex;
      this.shopParam.pageSize = response?.pageSize;
      this.totalCount = response.count;
      this.shopParam.sort = this.sort

  */

  getBrands(){
    this.shopService.getBrands().subscribe({
      next: response => this.brands = [{id:0,name:"All"},...response],
      error: error => console.log(error)
    })
  }

  getTypes(){
    this.shopService.getTypes().subscribe({
      next: response => this.types = [{id:0,name:"All"},...response],
      error: error => console.log(error)
    })
  }

  onBrandSelected(brandId: number){
    this.shopParam.brandId = brandId;
    this.getProductsWithParams();
    //this.getProducts()
  }

  onSearch(){
    this.shopParam.search = this.searchTerm?.nativeElement.value;
    this.shopParam.pageNumber = 1
    this.getProductsWithParams()
    //this.getProducts();
  }

  onReset(){
    this.searchTerm.nativeElement.value = ""
    this.shopParam.pageNumber = 1
    this.getProductsWithParams()
    //this.getProducts()
  }

  onTypeSelected(typeId: number){
    this.shopParam.typeId = typeId;
    this.getProductsWithParams();
    //this.getProducts()
  }

  onSortSelected(event: any){
    this.shopParam.sort = event.target.value;
    this.getProductsWithParams();
    //this.getProducts()
  }
}
