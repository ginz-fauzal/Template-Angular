import { Component
,OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Renderer2 } from '@angular/core';
import { environment } from "../../environments/environment";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  
  email: string="user1@example.com";
  password: string="password1";
  token:string='';

  constructor(private http: HttpClient,private router: Router,private renderer: Renderer2) {
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
