import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  rooms:any[] = [];
  roomId:number=0;
  userInfo:any;
  searchText="";
  image="";

  profileView=false;
  kontakView=false;

  constructor(private router: Router,private http: HttpClient,public services: ServicesService) {
    this.image!=localStorage.getItem("image");
    this.getData()
  }

  logout() {
    localStorage.clear();
    this.services.setStorage();
    this.router.navigate(['/login']);
  }

  onUserSelected(user:any){
    this.userInfo = user;
  }

  profileShow(){
    this.profileView=!this.profileView;
  }
  
  kontakShow(){
    this.kontakView=!this.kontakView;
  }

  getData(){
      const url = 'https://ardikastudio.site/template/room.php';
      const token = localStorage.getItem('accessToken');
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
    
      this.http.get<any>(url, { headers }).subscribe(
        response => {
          this.rooms = response.data;
        },
        error => {
          console.error(error);
        }
      );
  }

  conversationClicked(id:number){
    this.roomId=id
  }

}
