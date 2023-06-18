import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-kontak',
  templateUrl: './kontak.component.html',
  styleUrls: ['./kontak.component.scss']
})
export class KontakComponent {

  rooms:any[] = [];
  searchText="";
  
  constructor(private router: Router,private http: HttpClient,public services: ServicesService) {
    this.getData()
  }
 
  getData(){
      const url = 'https://ardikastudio.site/template/users.php';
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

}
