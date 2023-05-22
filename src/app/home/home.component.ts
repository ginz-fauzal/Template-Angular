import { Component,EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface RoomResponse {
  data: any[]; // Sesuaikan dengan struktur data yang sebenarnya
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  @Output() conversationClicked: EventEmitter<any> = new EventEmitter();
  searchText: string="";
  rooms:any[] = [];

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

  get filteredConversations() {
    return true
    // return this.conversations.filter((conversation) => {
    //   return (
    //     conversation.name
    //       .toLowerCase()
    //       .includes(this.searchText.toLowerCase()) ||
    //     conversation.latestMessage
    //       .toLowerCase()
    //       .includes(this.searchText.toLowerCase())
    //   );
    // });
  }

}
