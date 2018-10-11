import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService, UsersService } from '../../servicos/index.service';

@Component({
  selector: 'app-modal-delete',
  templateUrl: './modal-delete.component.html',
  styleUrls: ['./modal-delete.component.css']
})
export class ModalDeleteComponent implements OnInit {

  @Input() mUser;

  constructor(
    public activeModal: NgbActiveModal,
    private toastService: ToastService,
    private usersService: UsersService,
    private modalService: NgbModal) { }

  ngOnInit() {

  }

  delete() {

    this.usersService.deleteUser(this.mUser._id).subscribe(result => {
      //console.log("result: " + JSON.stringify(result));
      this.activeModal.close();
      this.toastService.remove('', 'Usuário');
    });
  }

}