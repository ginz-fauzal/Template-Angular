import { Component, Input,OnChanges,SimpleChanges,EventEmitter, OnInit, Output ,ElementRef, Renderer2, ViewChild } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { getMessaging, onMessage } from "firebase/messaging";
import { ServicesService } from '../services.service';
import { AfterViewChecked } from '@angular/core';

@Component({
  selector: 'app-room-chatting',
  templateUrl: './room-chatting.component.html',
  styleUrls: ['./room-chatting.component.scss']
})
export class RoomChattingComponent implements OnChanges,OnInit,AfterViewChecked  {

  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  @Output() userClicked: EventEmitter<any> = new EventEmitter();
  @Input() conversation!:number;

  chatText: string = '';
  roomId: number =0;

  chatData: any[] = [];

  showFileUpload = false;
  emojiPickerVisible=false;

  constructor(private http: HttpClient,public services: ServicesService,private renderer: Renderer2) {
    this.roomId=this.conversation
    this.fetchChatData();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.roomId=this.conversation
    console.log(this.roomId)
    this.fetchChatData();
    
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    const scrollContainer = this.scrollContainer.nativeElement;
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
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
    this.uploadImage(file);
  }

  uploadImage(file:any){
    const extension = file.name.split('.').pop().toLowerCase();

    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  
    if (allowedExtensions.includes(extension)) {
      this.sendImage(file).subscribe(
        response => {
          this.showFileUpload = false;
          this.fetchChatData()
        },
        error => {
          console.error(error);
        }
      );
      
    } else {
      console.log("File bukan gambar")
    }
  }

  sendImage(file:any){
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
          this.scrollToBottom()
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
    this.uploadImage(event.dataTransfer?.files[0]);
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
