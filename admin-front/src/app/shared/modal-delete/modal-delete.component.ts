import { Component, OnInit, Input ,ChangeDetectorRef,Output,EventEmitter} from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { UserService } from '../../servicos/user.service';
import { ToastService } from '../../servicos/toast.service';
declare var $:any;

@Component({
  selector: 'app-modal-delete',
  templateUrl: './modal-delete.component.html',
  styleUrls: ['./modal-delete.component.css']
})
export class ModalDeleteComponent implements OnInit {
  @Input() view;
  @Input() type;


  constructor(
    public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private userService : UserService,
    private toastService : ToastService,
  ) { }

  ngOnInit() {
    console.log(this.view);
    console.log(this.type);
  }

  delete(){
   this.userService.deleteUser(this.view._id).subscribe( result => {this.toastService.remove('/rc/home/lista','Usuário');this.activeModal.close('remove') });
  }



}
