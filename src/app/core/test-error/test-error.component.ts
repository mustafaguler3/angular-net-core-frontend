import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrls: ['./test-error.component.scss']
})
export class TestErrorComponent {

  baseUrl = "http://localhost:5182/api/"
  validationErrors: string[] = []

  constructor(private http:HttpClient){}

  get404Error(){
    this.http.get(this.baseUrl+"not-found").subscribe({
      next: (response) => {
        console.log(response)
      }
    })
  }

  get500Error(){
    this.http.get(this.baseUrl+"buggy/server-error").subscribe({
      next: (response) => {
        console.log(response)
      },error: (err)=> {
        this.validationErrors = err.errors
      }
    })
  }

  get400Error(){
    this.http.get(this.baseUrl+"buggy/bad-request").subscribe({
      next: (response) => {
        console.log(response)
      },error: (err)=> {
        this.validationErrors = err.errors
      }
    })
  }
}
