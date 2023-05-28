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

  searchText: string="";
  rooms:any[] = [];
  roomId:number;
  profileView=false;
  userInfo:any;

  constructor(private router: Router,private http: HttpClient,public services: ServicesService) {
    this.getData()
    this.roomId=Number(this.services.decryptData(localStorage.getItem('roomId')!));
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  onUserSelected(user:any){
    this.userInfo = user;
  }

  profileShow(){
    this.profileView=!this.profileView;
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

  conversationClicked(id:number,name:string){
    localStorage.setItem('roomId', this.services.encryptData(id.toString()));
    localStorage.setItem('namaRoom', this.services.encryptData(name));
    this.roomId=id
  }

}
