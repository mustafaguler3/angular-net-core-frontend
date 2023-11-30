import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bad-request',
  templateUrl: './bad-request.component.html',
  styleUrls: ['./bad-request.component.scss']
})
export class BadRequestComponent {
  error: any

  constructor(private router:Router){
    const navigation = this.router.getCurrentNavigation();
    this.error = navigation.extras.state?.["error"];
  }
}
