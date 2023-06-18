import { Component,Input,OnChanges, SimpleChanges} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnChanges{
  
  @Input() userInfo:any;

  userData:any=[];
  userId="";

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.userId=this.userInfo
    this.getData()
  }

  getData(){
    console.log(this.userInfo)
    console.log(this.userId)
    const token = localStorage.getItem('accessToken');
    const url = 'https://ardikastudio.site/template/user.php';
    const data = {
      userId: this.userId
    };
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    this.http.post<any>(url, data, { headers }).subscribe(
      response => {
        this.userData=response.data
        console.log(response);
      },
      error => {
        console.error(error);
      }
    );
  }
}

