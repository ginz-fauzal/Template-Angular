import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // Cek apakah pengguna telah login
    if (localStorage.getItem('accessToken')) {
      return true; // Izinkan akses
    } else {
      // Jika pengguna belum login, arahkan ke halaman login
      this.router.navigate(['/login']);
      return false; // Blokir akses
    }
  }
}