import { Component, OnInit  } from '@angular/core';
import { getMessaging, getToken } from "firebase/messaging";
import { environment } from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor() {}

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
        console.log(currentToken)
     }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
    });
  }

}

