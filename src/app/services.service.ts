import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { format, isToday, isYesterday, subDays } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor() { }

  encryptData(data: string): string {
    return CryptoJS.AES.encrypt(data,"12").toString();
  }

  decryptData(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData,"12");
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

}
