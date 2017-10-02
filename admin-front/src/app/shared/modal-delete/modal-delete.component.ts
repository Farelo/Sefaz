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

  public address: any = {};
  public center: any;
  public pos : any;
  public users: any;

  constructor(
    public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private userService: UserService,
    private toastService: ToastService,
    private router: Router

  ) { }

  ngOnInit() {
    console.log(this.view);
    console.log(this.type);
  }

  delete(){
    this.userService.deleteUser(this.view._id).subscribe( result => {this.toastService.remove('/rc/home','Usuário');this.activeModal.close('remove') });
  }

}
