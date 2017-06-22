import { Component, OnInit,OnDestroy  } from '@angular/core';
import { ChatService }       from '../../servicos/teste';
@Component({
  selector: 'app-importar',
  templateUrl: './importar.component.html',
  styleUrls: ['./importar.component.css']
})
export class ImportarComponent implements OnInit ,OnDestroy{

  messages = [];
  connection;
  message;

  constructor(private chatService: ChatService) { }



  sendMessage() {
    this.chatService.sendMessage(this.message);
    this.message = '';
  }



  ngOnInit() {
    this.connection = this.chatService.getMessages().subscribe(message => {
      this.messages.push(message);
    })

  }


  ngOnDestroy() {
    this.connection.unsubscribe();
  }


}
