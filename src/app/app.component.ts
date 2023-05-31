import { Component,OnInit  } from '@angular/core';
import { ServicesService } from './services.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private services:ServicesService) {
    
    localStorage.setItem('roomId', this.services.encryptData("0"));
    localStorage.setItem('namaRoom', this.services.encryptData("0"));
  }

  ngOnInit(): void {
     
  }
}

