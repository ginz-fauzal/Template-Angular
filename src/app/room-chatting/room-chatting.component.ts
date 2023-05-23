import { Component, Input,OnChanges,SimpleChanges,OnInit   } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { format, isToday, isYesterday, subDays } from 'date-fns';
import { getMessaging, getToken, onMessage } from "firebase/messaging";

@Component({
  selector: 'app-room-chatting',
  templateUrl: './room-chatting.component.html',
  styleUrls: ['./room-chatting.component.scss']
})
export class RoomChattingComponent implements OnChanges,OnInit {
  chatText: string = '';
  roomId!: number ;
  chatData: any[] = [];

  @Input() conversation!:number;
  message = '';

  constructor(private http: HttpClient,private route: ActivatedRoute) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      this.fetchChatData();
    }
  }

  ngOnInit(): void {
    // console.log('Requesting permission...');
      
  this.listen();
}

  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      this.fetchChatData()
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
    formData.append('roomId', this.conversation.toString());
  
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
      roomId: this.conversation,
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
    const url = `https://ardikastudio.site/template/chat.php?roomId=${this.conversation}`;
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
