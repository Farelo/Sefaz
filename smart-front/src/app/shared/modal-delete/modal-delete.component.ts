import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService, UsersService, CompaniesService, FamiliesService, PackingService, ControlPointsService, RoutesService, ProjectService, DepartmentService, GC16Service } from '../../servicos/index.service';
import { MeterFormatter } from '../pipes/meter_formatter';

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
    private controlPointsService: ControlPointsService,
    private routesService: RoutesService,
    private projectService: ProjectService,
    private departmentService: DepartmentService,
    private gc16Service: GC16Service,
    private modalService: NgbModal) { }

  ngOnInit() {
    //console.log('mObject: ' + JSON.stringify(this.mObject));
    //console.log('mType: ' + JSON.stringify(this.mType));
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
      
      case "CONTROL_POINT":
        this.controlPointsService.deleteControlPoint(this.mObject._id).subscribe(res => {
          this.toastService.remove('', 'Ponto de Controle');
          this.activeModal.close();
        });
        break;

      case "ROUTE":
        this.routesService.deleteRoute(this.mObject._id).subscribe(res => {
          this.toastService.remove('', 'Rota');
          this.activeModal.close();
        });
        break;

      case "PROJECT":
        this.projectService.deleteProject(this.mObject._id).subscribe(res => {
          this.toastService.remove('', 'Projeto');
          this.activeModal.close();
        });
        break;
      
      case "DEPARTMENT":
        this.departmentService.deleteDepartment(this.mObject._id).subscribe(res => {
          this.toastService.remove('', 'Departamento');
          this.activeModal.close();
        });
        break;

      case "BPLINE":
        this.gc16Service.deleteGC16(this.mObject._id).subscribe(res => {
          this.toastService.remove('', 'BPLINE');
          this.activeModal.close();
        });
        break;
    }
  }


  /**
   * Misc
   */
  getFormatedDistance(value: number) { 
    return (new MeterFormatter()).to(value / 1000);
  }
}
