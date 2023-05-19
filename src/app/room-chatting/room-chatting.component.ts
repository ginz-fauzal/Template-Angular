import { Component } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-room-chatting',
  templateUrl: './room-chatting.component.html',
  styleUrls: ['./room-chatting.component.scss']
})
export class RoomChattingComponent {
  chatText: string = '';
  roomId: string = '';
  chatData: any[] = [];

  constructor(private http: HttpClient,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.roomId = params.get('roomId')!;
      console.log('roomId:', this.roomId);
      this.fetchChatData();
      // Lakukan logika lain yang diperlukan dengan roomId di sini
    });
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    const token = localStorage.getItem('accessToken');
    // Membuat header dengan menambahkan token bearer
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    // Membuat FormData untuk mengirim file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('roomId', this.roomId);
  
    // Mengirim permintaan POST ke upload.php
    return this.http.post('https://ardikastudio.site/template/upload.php', formData, { headers }).subscribe(
      response => {
        event.target.value = null;
        this.fetchChatData()
        console.log(response);
        // Perform other logic with the chat data here
      },
      error => {
        console.error(error);
        // Handle error
      }
    );
  }

  sendMessage() {
    // Jika hanya pesan teks
    const token = localStorage.getItem('accessToken');

    // Tentukan URL dan data yang akan dikirim
    const url = 'https://ardikastudio.site/template/chatsend.php';
    const data = {
      roomId: this.roomId,
      message: this.chatText
    };
    
    // Menentukan header dengan bearer token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // Kirim permintaan HTTP POST
    this.http.post(url, data, { headers }).subscribe(
      response => {
        // Tangani respons dari server
        this.fetchChatData();
        this.chatText="";
        console.log(response);
      },
      error => {
        // Tangani error jika permintaan gagal
        console.error(error);
      }
    );
    
  }


  fetchChatData() {
    const token = localStorage.getItem('accessToken');
    const url = `https://ardikastudio.site/template/chat.php?roomId=${this.roomId}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>(url, { headers }).subscribe(
      response => {
        this.chatData = response.data;
        console.log('Chat data:', this.chatData);
        // Perform other logic with the chat data here
      },
      error => {
        console.error(error);
        // Handle error
      }
    );
  }
}
