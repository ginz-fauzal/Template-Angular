import { Component} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  userData:any=[];

  constructor(private http: HttpClient) {
    this.getData()
  }

  getData(){
      const url = 'https://ardikastudio.site/template/me.php';
      const token = localStorage.getItem('accessToken');
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
    
      this.http.get<any>(url, { headers }).subscribe(
        response => {
          this.userData = response.data;
        },
        error => {
          console.error(error);
        }
      );
  }
}

