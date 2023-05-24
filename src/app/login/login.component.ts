import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Renderer2 } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  
  email: string="user1@example.com";
  password: string="password1";

  constructor(private http: HttpClient,private router: Router,private renderer: Renderer2) {
    if (localStorage.getItem('accessToken')) {
      this.router.navigate(['/home']);
    }
  }

  login() {
    const loginData = {
      email: this.email,
      password: this.password
    };

    this.http.post('https://ardikastudio.site/template/login.php', loginData).subscribe(
      (response: any) => {
        if (response.code === 200 && response.status === 'success') {
          localStorage.setItem('accessToken', response.data.token);
          
          this.router.navigate(['/home']);
        } else {
          console.log('Login failed');
        }
        console.log(response);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  handleLogInClick() {
    this.renderer.addClass(document.querySelector('.signIn'), 'active-dx');
    this.renderer.addClass(document.querySelector('.signUp'), 'inactive-sx');
    this.renderer.removeClass(document.querySelector('.signUp'), 'active-sx');
    this.renderer.removeClass(document.querySelector('.signIn'), 'inactive-dx');
  }

  handleBackClick() {
    this.renderer.addClass(document.querySelector('.signUp'), 'active-sx');
    this.renderer.addClass(document.querySelector('.signIn'), 'inactive-dx');
    this.renderer.removeClass(document.querySelector('.signIn'), 'active-dx');
    this.renderer.removeClass(document.querySelector('.signUp'), 'inactive-sx');
  }
}
