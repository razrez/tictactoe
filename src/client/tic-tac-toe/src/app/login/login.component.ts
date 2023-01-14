import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  invalidLogin: boolean = false;

  constructor(private router: Router, private http: HttpClient) {

  }

  login(form: NgForm){
    const credentials = {
      'username': form.value.username,
      'password': form.value.password,
      'confirmPassword': form.value.confirmPassword,
    };

    this.http.post("https://localhost:5001/api/auth/login", credentials)
      .subscribe(response => {
        const token = (<any>response).token;
        localStorage.setItem("jwt", token);

        this.invalidLogin = false;
        this.router.navigate(["/"]).catch(err => console.log(err));
      }, error => {
        this.invalidLogin = true;
      });
  }
}
