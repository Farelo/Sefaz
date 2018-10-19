import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService, UsersService, CompaniesService, FamiliesService, PackingService } from '../../servicos/index.service';

@Component({
  selector: 'app-modal-delete',
  templateUrl: './modal-delete.component.html',
  styleUrls: ['./modal-delete.component.css']
})
export class ModalDeleteComponent implements OnInit {

  @Input() mObject;
  @Input() mType: any;

  constructor(
    public activeModal: NgbActiveModal,
    private toastService: ToastService,
    private usersService: UsersService,
    protected companiesService: CompaniesService,
    private familyService: FamiliesService,
    private packingService: PackingService,
    private modalService: NgbModal) { }

  ngOnInit() {
    console.log('mObject: ' + JSON.stringify(this.mObject));
    console.log('mType: ' + JSON.stringify(this.mType));
  }

  delete() {

    switch (this.mType){

      case "USER":
        this.usersService.deleteUser(this.mObject._id).subscribe(result => {
          this.toastService.remove('', 'Usuário');
          this.activeModal.close();
        });
        break;

      case "COMPANY":
        this.companiesService.deleteCompany(this.mObject._id).subscribe(res => {
            this.toastService.remove('', 'Empresa', true); 
            this.activeModal.close();
          });
        break;
      
      case "FAMILY":
        this.familyService.deleteFamily(this.mObject._id).subscribe(res => {
            this.toastService.remove('', 'Família', true);
            this.activeModal.close();
          });
        break;

      case "PACKING":
        this.packingService.deletePacking(this.mObject._id).subscribe(res => {
          this.toastService.remove('', 'Embalagem', true);
          this.activeModal.close();
        });
        break;
    }
    
  }

}
