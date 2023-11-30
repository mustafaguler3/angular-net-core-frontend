import { Injectable} from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http"
import { Pagination } from '../shared/models/pagination';
import { Product } from '../shared/models/product';
import { Brand } from '../shared/models/brand';
import { Type } from '../shared/models/type';
import { map } from 'rxjs';
import { ShopParams } from '../shared/models/shopparams';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  baseUrl = "http://localhost:5182/api/"

  constructor(private http: HttpClient) { }

  getProductsNoParams(){
    return this.http.get<Product[]>(this.baseUrl + "products/get-product-no-params")
  }

  getProductsWithParams(shopParam: ShopParams){
    let params = new HttpParams();

    if(shopParam.brandId > 0){
      params = params.append("brandId",shopParam.brandId)
    }

    if(shopParam.typeId){
      params = params.append("typeId",shopParam.typeId)
    }
    params = params.append("sort",shopParam.sort)
    params = params.append("pageIndex",shopParam.pageNumber?.toString())
    params = params.append("pageSize",shopParam.pageSize?.toString())
    
    if(shopParam.search){
      params = params.append("search",shopParam.search)
    }

    

    return this.http.get<Pagination<Product[]>>(this.baseUrl + "products",{params})
  }

  getProduct(id: number){
    return this.http.get<Product>(this.baseUrl+"products/"+id)
  }

  getBrands(){
    return this.http.get<Brand[]>(this.baseUrl + "products/brands")
  }

  getTypes(){
    return this.http.get<Type[]>(this.baseUrl + "products/types")
  }
}
