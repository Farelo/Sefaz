import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService, UsersService, CompaniesService, FamiliesService, PackingService, ControlPointsService, RoutesService, ProjectService, DepartmentService, GC16Service, ControlPointTypesService } from '../../servicos/index.service';
import { MeterFormatter } from '../pipes/meter_formatter';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-delete',
  templateUrl: './modal-delete.component.html',
  styleUrls: ['./modal-delete.component.css']
})
export class ModalDeleteComponent implements OnInit {

  @Input() mObject;
  @Input() mType: any;

  constructor(public translate: TranslateService,
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
    private controlPointTypesService: ControlPointTypesService,
    private modalService: NgbModal) { 

      if (translate.getBrowserLang() == undefined || this.translate.currentLang == undefined) translate.use('pt');
    }

  ngOnInit() {
    // console.log('mObject: ' + JSON.stringify(this.mObject));
    // console.log('mType: ' + JSON.stringify(this.mType));
  }

  delete() {

    switch (this.mType){

      case "USER":
        this.usersService.deleteUser(this.mObject._id).subscribe(result => {
          this.toastService.remove('', this.translate.instant('MISC.TOAST.USER'));  
          this.activeModal.close();
        });
        break;

      case "COMPANY":
        this.companiesService.deleteCompany(this.mObject._id).subscribe(res => {
            this.toastService.remove('', this.translate.instant('MISC.TOAST.COMPANY'), true); 
            this.activeModal.close();
          });
        break;
      
      case "FAMILY":
        this.familyService.deleteFamily(this.mObject._id).subscribe(res => {
            this.toastService.remove('', this.translate.instant('MISC.TOAST.FAMILY'), true);
            this.activeModal.close();
          });
        break;

      case "PACKING":
        this.packingService.deletePacking(this.mObject._id).subscribe(res => {
          this.toastService.remove('', this.translate.instant('MISC.TOAST.PACKAGE'), true);
          this.activeModal.close();
        });
        break;
      
      case "CONTROL_POINT":
        this.controlPointsService.deleteControlPoint(this.mObject._id).subscribe(res => {
          this.toastService.remove('', this.translate.instant('MISC.TOAST.CONTROL_POINT'));
          this.activeModal.close();
        });
        break;

      case "ROUTE":
        this.routesService.deleteRoute(this.mObject._id).subscribe(res => {
          this.toastService.remove('', this.translate.instant('MISC.TOAST.ROUTE'));
          this.activeModal.close();
        });
        break;

      case "PROJECT":
        this.projectService.deleteProject(this.mObject._id).subscribe(res => {
          this.toastService.remove('', this.translate.instant('MISC.TOAST.PROJECT'));
          this.activeModal.close();
        });
        break;
      
      case "DEPARTMENT":
        this.departmentService.deleteDepartment(this.mObject._id).subscribe(res => {
          this.toastService.remove('', this.translate.instant('MISC.TOAST.DEPARTMENT'));
          this.activeModal.close();
        });
        break;

      case "BPLINE":
        this.gc16Service.deleteGC16(this.mObject._id).subscribe(res => {
          this.toastService.remove('', this.translate.instant('MISC.TOAST.BPLINE'));
          this.activeModal.close();
        });
        break;

      case "CONTROL_POINT_TYPE":
        this.controlPointTypesService.deleteType(this.mObject._id).subscribe(res => {
          this.toastService.remove('', this.translate.instant('MISC.TOAST.TYPE'));
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
