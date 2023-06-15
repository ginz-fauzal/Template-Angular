import { Component} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SafeUrl, DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  userData:any=[];
  image: string |SafeUrl ="";

  constructor(private http: HttpClient,private sanitizer: DomSanitizer) {
    this.getData()
  }

  updateImage(ev:any) {
    this.image = this.sanitizer.bypassSecurityTrustUrl(
      window.URL.createObjectURL(ev.target.files[0])
    );

    this.uploadImage(ev.target.files[0]).subscribe(
      response => {
        this.getData()
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
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post('https://ardikastudio.site/template/uploadfoto.php', formData, { headers })
  }

  getData(){
      const url = 'https://ardikastudio.site/template/me.php';
      const token = localStorage.getItem('accessToken');
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
    
      this.http.get<any>(url, { headers }).subscribe(
        response => {
          this.userData = response.data;
          this.image=this.userData.foto
        },
        error => {
          console.error(error);
        }
      );
  }
}

