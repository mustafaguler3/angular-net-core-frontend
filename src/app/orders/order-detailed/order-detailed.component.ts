import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/shared/models/order';
import { OrdersService } from '../orders.service';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-order-detailed',
  templateUrl: './order-detailed.component.html',
  styleUrls: ['./order-detailed.component.scss']
})
export class OrderDetailedComponent implements OnInit {
 
  order?: Order;

  constructor(private orderService: OrdersService,
              private route: ActivatedRoute,
              private bcService: BreadcrumbService){}

  ngOnInit(): void {
      const id = this.route.snapshot.paramMap.get("id");
      id && this.orderService.getOrderDetailed(+id).subscribe({
        next: order => {
          this.order = order;
          this.bcService.set('@OrderDetailed',`Order# ${order.id} - ${order.status}`);
        }
      })
  }
}
