import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

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

}
