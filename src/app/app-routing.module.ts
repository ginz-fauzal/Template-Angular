import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RoomChattingComponent } from './room-chatting/room-chatting.component';
import { ProfileComponent } from './profile/profile.component';

// Definisikan rute-rute aplikasi
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect ke halaman login jika URL kosong
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'room-chatting/:roomId', component: RoomChattingComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  
  // Tambahkan rute-rute lain jika diperlukan
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }