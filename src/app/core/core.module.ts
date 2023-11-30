import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';
import { TestErrorComponent } from './test-error/test-error.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { ToastrModule } from 'ngx-toastr';
import { BadRequestComponent } from './bad-request/bad-request.component';
import { SectionHeaderComponent } from './section-header/section-header.component';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BasketModule } from '../basket/basket.module';
import { AccountModule } from '../account/account.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  declarations: [
    NavBarComponent, 
    TestErrorComponent, 
    NotFoundComponent, 
    ServerErrorComponent, 
    BadRequestComponent, 
    SectionHeaderComponent],
  imports: [
    CommonModule,
    RouterModule,
    BasketModule,
    ToastrModule.forRoot({
      positionClass:"toast-bottom-right",
      preventDuplicates:true
    }),
    BreadcrumbModule,
    NgxSpinnerModule,
    AccountModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot()
  ],
  exports: [
    NavBarComponent,
    TestErrorComponent,
    NotFoundComponent,
    ServerErrorComponent,
    SectionHeaderComponent,
    NgxSpinnerModule,
    BadRequestComponent]
})
export class CoreModule { }
