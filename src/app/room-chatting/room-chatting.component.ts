import { Component, Input,OnChanges,SimpleChanges,EventEmitter, OnInit, Output   } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { getMessaging, onMessage } from "firebase/messaging";
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-room-chatting',
  templateUrl: './room-chatting.component.html',
  styleUrls: ['./room-chatting.component.scss']
})
export class RoomChattingComponent implements OnChanges,OnInit {

  @Output() userClicked: EventEmitter<any> = new EventEmitter();

  chatText: string = '';
  roomId: number =0;
  chatData: any[] = [];

  @Input() conversation!:number;
  showFileUpload = false;
  emojiPickerVisible=false;
  nama?:string;

  constructor(private http: HttpClient,public services: ServicesService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      this.nama=this.services.decryptData(localStorage.getItem('namaRoom')!);
      this.roomId=Number(this.services.decryptData(localStorage.getItem('roomId')!));
      this.fetchChatData();
    }
  }

  emojiClicked(event:any) {
    this.chatText += event.emoji.native;
    this.emojiPickerVisible=false
  }

  ngOnInit(): void {
    this.listen();
  }


  openFileUpload() {
    this.showFileUpload = !this.showFileUpload;
  }

  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      this.fetchChatData()
    });
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    this.uploadImage(file).subscribe(
      response => {
        event.target.value = null;
        this.showFileUpload = false;
        this.fetchChatData()
      },
      error => {
        console.error(error);
      }
    );
  }

  uploadImage(file:any){
    console.log(file)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('roomId', this.conversation.toString());
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post('https://ardikastudio.site/template/upload.php', formData, { headers })
  }

  sendMessage() {
    if(this.chatText!='\n'){
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
    }else{
      this.chatText=''
    }
  }

  fetchChatData() {
    if(this.conversation!=0){
      const token = localStorage.getItem('accessToken');
      const url = `https://ardikastudio.site/template/chat.php?roomId=${this.conversation}`;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
      this.http.get<any>(url, { headers }).subscribe(
        response => {
          this.chatData = response.data;
          console.log(this.chatData)
        },
        error => {
          console.error(error);
        }
      );
    }
  }

  onFileDropped(event: DragEvent) {
    event.preventDefault();
    console.log(event.dataTransfer?.files)
    this.uploadImage(event.dataTransfer?.files[0]).subscribe(
      response => {
        this.showFileUpload = false;
        this.fetchChatData()
      },
      error => {
        console.error(error);
      }
    );
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
}
