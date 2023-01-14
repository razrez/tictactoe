import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  isInvalid: boolean = false;

  constructor(private router: Router, private http: HttpClient) {

  }

  signup(form: NgForm){
    const credentials = {
      'username': form.value.username,
      'email': form.value.email,
      'password': form.value.password,
      'passwordConfirm': form.value.passwordConfirm,
    };

    this.http.post("https://localhost:5001/api/auth/signup", credentials)
      .subscribe(response => {
        const token = (<any>response).token;
        localStorage.setItem("jwt", token);

        this.isInvalid = false;
        this.router.navigate(["login"]).catch(err => console.log(err));
      }, error => {
        this.isInvalid = true;
      });
  }
}
