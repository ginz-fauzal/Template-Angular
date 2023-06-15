import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { format, isToday, isYesterday, subDays } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor() { }

  encryptData(data: string): string {
    return CryptoJS.AES.encrypt(data,"password").toString();
  }

  decryptData(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData,"password");
    return bytes.toString(CryptoJS.enc.Utf8);
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

  setStorage(){
    localStorage.setItem('roomId', this.encryptData("0"));
    localStorage.setItem('namaRoom', this.encryptData("0"));
    localStorage.setItem('imageRoom', this.encryptData("../../assets/images/noPic.svg"));
    localStorage.setItem('image', this.encryptData("../../assets/images/noPic.svg"));
  }

}
