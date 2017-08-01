import { Component, OnInit, NgZone } from '@angular/core';
declare var $:any;

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
menuAparecer: boolean = false;
private telaGrande: boolean = false;
altura: any;
largura: any;

  constructor(private ngZone:NgZone) {

  }

  ngOnInit() {
    this.funcaoTop();
    this.menuAparecer = false;
  }

  funcaoTop(){
    $('.scroll').click(function() {
        $('label').click();
        return false;
    });
  }

  mudar(){
    if(this.menuAparecer == false ){
      this.menuAparecer = true;
    } else{
      this.menuAparecer = false;
    }
  }
outraFuncaoTop(){
  $('label').click();
  // return false;
}
}
