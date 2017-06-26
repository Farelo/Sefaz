import { Observable } from 'rxjs/Observable';

import * as io from 'socket.io-client';



export class ChatService {

  private url = 'http://isi.pe.senai.br:8984';

  private socket;


  sendMessage(message) {

    this.socket.emit('add-message', message);
    console.log("MESSAGE SENT");

  }



  getMessages() {

    let observable = new Observable(observer => {

      this.socket = io(this.url);

      this.socket.on('message', (data) => {
        console.log(data);
        observer.next(data);

      });

      return () => {

        this.socket.disconnect();

      }

    })

    return observable;

  }

}
