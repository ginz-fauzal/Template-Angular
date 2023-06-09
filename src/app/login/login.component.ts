import { Component,OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Renderer2 } from '@angular/core';
import { environment } from "../../environments/environment";
import { getMessaging, getToken } from "firebase/messaging";
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  
  email: string="user2@example.com";
  password: string="password2";
  username: string="users";
  token:string='';

  constructor(private http: HttpClient,private router: Router,private renderer: Renderer2,private services: ServicesService) {
    if (localStorage.getItem('accessToken')) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        this.requestPermission();
      }
    })
  }

  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging, 
     { vapidKey: environment.firebase.vapidKey}).then(
       (currentToken) => {
        this.token=currentToken
        console.log(this.token)
     }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
    });
  }

  login() {
    console.log(this.token)
    const loginData = {
      email: this.email,
      password: this.password,
      token:this.token
    };

    this.http.post('https://ardikastudio.site/template/login.php', loginData).subscribe(
      (response: any) => {
        if (response.code === 200 && response.status === 'success') {
          this.services.setStorage();
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('image', this.services.encryptData(response.data.foto));
          this.router.navigate(['/home']);
        } else {
          console.log('Login failed');
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  register() {
    console.log(this.token)
    const loginData = {
      email: this.email,
      password: this.password,
      username:this.username
    };

    this.http.post('https://ardikastudio.site/template/register.php', loginData).subscribe(
      (response: any) => {
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
