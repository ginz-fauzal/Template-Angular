import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { format, isToday, isYesterday, subDays } from 'date-fns';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  searchText: string="";
  rooms:any[] = [];
  roomId:number=0;

  constructor(private router: Router,private http: HttpClient) {
    this.getData()
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.router.navigate(['/login']);
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
          console.log(this.rooms);
        },
        error => {
          console.error(error);
        }
      );
  }

  navigateToRoom(roomId: string) {
    this.router.navigate(['/room-chatting', roomId]);
  }

  conversationClicked(id:number){
    this.roomId=id
    console.log(this.roomId)
  }

  formatDateTime(dateTime: string): string {
    const time = new Date(dateTime);
    const formattedTime = format(time, 'HH:mm');
    const yesterday = subDays(new Date(), 1);
    const yesterdayFormatted = isYesterday(time) ? 'kemarin' : formattedTime;
    const today = new Date();
    const dateFormatted = isToday(time) ? formattedTime : format(time, 'dd/MM/yyyy');
    
    if (isYesterday(time)) {
      return yesterdayFormatted;
    } else if (time < today) {
      return dateFormatted;
    } else {
      return formattedTime;
    }
  }
}
