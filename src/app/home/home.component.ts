import { Component,EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { format, isToday, isYesterday, subDays } from 'date-fns';

interface RoomResponse {
  data: any[]; // Sesuaikan dengan struktur data yang sebenarnya
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  searchText: string="";
  rooms:any[] = [];
  roomId:number=1;

  constructor(private router: Router,private http: HttpClient) {
    this.getData()
  }

  logout() {
    localStorage.removeItem('accessToken');
  
  // Mengarahkan pengguna ke halaman login
  this.router.navigate(['/login']);
  }

  getData(){
      // URL tujuan
      const url = 'https://ardikastudio.site/template/room.php';
    
      // Token yang diperoleh setelah login
      const token = localStorage.getItem('accessToken');
      // console.log(token)
    
      // Header dengan bearer token
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
    
      // Mengirim permintaan GET dengan header Authorization
      this.http.get<RoomResponse>(url, { headers }).subscribe(
        response => {
          // Tangani respons dari server
          
          this.rooms = response.data;
          // console.log(this.rooms);
        },
        error => {
          // Tangani error jika permintaan gagal
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
    
    // Mengubah format tanggal dan waktu menjadi jam dan menit saja
    const formattedTime = format(time, 'HH:mm');
    
    // Mengubah format tanggal dan waktu menjadi 'kemarin' jika 1 hari yang lalu
    const yesterday = subDays(new Date(), 1);
    const yesterdayFormatted = isYesterday(time) ? 'kemarin' : formattedTime;
    
    // Mengubah format tanggal dan waktu menjadi tanggal saja jika lebih dari 1 hari yang lalu
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
