import { Product } from "./product";

export interface Pagination<T> {
    pageIndex: number;
    pageSize: number;
    count: number;
    data: Product[]
}