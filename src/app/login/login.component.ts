import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string="user1@example.com";
  password: string="password1";

  constructor(private http: HttpClient,private router: Router) {
    if (localStorage.getItem('accessToken')) {
      this.router.navigate(['/home']);
    }
  }

  login() {
    // Mengirim data login ke API menggunakan HTTP POST request
    const loginData = {
      email: this.email,
      password: this.password
    };

    this.http.post('https://ardikastudio.site/template/login.php', loginData).subscribe(
      (response: any) => {
        if (response.code === 200 && response.status === 'success') {
          // Login berhasil, simpan data pengguna ke penyimpanan lokal
          console.log(response.data.token)
          localStorage.setItem('accessToken', response.data.token);
          
          // Arahkan pengguna ke halaman home
          this.router.navigate(['/home']);
        } else {
          // Login gagal, tampilkan pesan error atau tindakan lainnya
          console.log('Login failed');
        }
        console.log(response);
      },
      (error) => {
        // Penanganan error jika ada kesalahan dalam proses login
        console.error(error);
      }
    );
  }
}
