import { Component, Input,OnChanges,SimpleChanges,OnInit   } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { format, isToday, isYesterday, subDays } from 'date-fns';
import { getMessaging, onMessage } from "firebase/messaging";

@Component({
  selector: 'app-room-chatting',
  templateUrl: './room-chatting.component.html',
  styleUrls: ['./room-chatting.component.scss']
})
export class RoomChattingComponent implements OnChanges,OnInit {
  chatText: string = '';
  roomId: number =0;
  chatData: any[] = [];

  @Input() conversation!:number;
  message = '';

  constructor(private http: HttpClient) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      this.fetchChatData();
    }
  }

  ngOnInit(): void {
    this.listen();
  }

  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      this.fetchChatData()
    });
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('roomId', this.conversation.toString());
  
    return this.http.post('https://ardikastudio.site/template/upload.php', formData, { headers }).subscribe(
      response => {
        event.target.value = null;
        this.fetchChatData()
      },
      error => {
        console.error(error);
      }
    );
  }

  sendMessage() {
    const token = localStorage.getItem('accessToken');
    const url = 'https://ardikastudio.site/template/chatsend.php';
    const data = {
      roomId: this.conversation,
      message: this.chatText
    };
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    this.http.post(url, data, { headers }).subscribe(
      response => {
        this.fetchChatData();
        this.chatText="";
        console.log(response);
      },
      error => {
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
      },
      error => {
        console.error(error);
      }
    );
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
