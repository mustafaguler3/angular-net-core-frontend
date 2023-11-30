import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router,
              private toast: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
      if(err){
        if(err.status === 400){
          if(err.error.errors){
            throw err.error
          }else {
            this.toast.error(err.error.message,err.status.toString())
          }
        }
      }
      if(err.status === 401){
        this.toast.error(err.error.message,err.status.toString())
      }

      if(err.status === 404){
        this.router.navigateByUrl("/not-found")
      }
      if(err.status === 500){
        const navigationExtras: NavigationExtras = {state:{error: err.error}}
        this.router.navigateByUrl("/server-error",navigationExtras)
      }

      return throwError(() => new Error(err.message));
    }))
  }
}
