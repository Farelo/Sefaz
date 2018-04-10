import { Component, OnInit, Input ,ChangeDetectorRef,Output,EventEmitter} from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CEPService, 
  ProjectService, 
  GC16Service, 
  ProfileService, 
  PackingService,
  DepartmentService, 
  RoutesService, 
  TagsService, 
  PlantsService, 
  ToastService
} from '../../servicos/index.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { Supplier } from '../../shared/models/supplier';
import { Profile } from '../../shared/models/profile';
import { Plant } from '../../shared/models/plant';

declare var $:any;

@Component({
  selector: 'app-modal-delete',
  templateUrl: './modal-delete.component.html',
  styleUrls: ['./modal-delete.component.css']
})
export class ModalDeleteComponent implements OnInit {
  @Input() view;
  @Input() type;


  private perfil = 'FORNECEDOR';
  public autocomplete: google.maps.places.Autocomplete;
  public address: any = {};
  public center: any;
  public pos : any;
  public users: any;

  constructor(
    public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private router: Router,
    private departmentService : DepartmentService,
    private tagsService : TagsService,
    private profileService : ProfileService,
    private plantsService : PlantsService,
    private CEPService : CEPService,
    private ref: ChangeDetectorRef,
    private packingService: PackingService,
    private projectService: ProjectService,
    private toastService: ToastService,
    private routesService: RoutesService,
    private gc16Service: GC16Service,
  ) { }

  ngOnInit() {
    console.log(this.view);
    console.log(this.type);
  }

  delete(){

    switch (this.type) {
      case "packing":
        this.packingService.deletePacking(this.view._id).subscribe( result => {this.toastService.remove('/rc/cadastros/embalagem','Embalagem');this.activeModal.close('remove') });
        break;
      case "route":
        this.routesService.deleteRoute(this.view._id).subscribe(result =>  {this.toastService.remove('/rc/cadastros/rotas','Rota');this.activeModal.close('remove') });
        break;
      case "gc16":
        this.gc16Service.deleteGC16(this.view._id).subscribe(result => {this.toastService.remove('/rc/gc16','GC16');this.activeModal.close('remove') });
        break;
      case "plant":
        this.plantsService.deletePlant(this.view._id).subscribe(result => {this.toastService.remove('/rc/cadastros/planta','PLanta');this.activeModal.close('remove') });
        break;
      case "project":
        this.projectService.deleteProject(this.view._id).subscribe(result => {this.toastService.remove('/rc/cadastros/plataforma','Plataforma');this.activeModal.close('remove') });
        break;
      case "tag":
        this.tagsService.deleteTag(this.view._id).subscribe(result => {this.toastService.remove('/rc/cadastros/tags','Plataforma');this.activeModal.close('remove') });
        break;
      case "department":
        this.departmentService.deleteDepartment(this.view._id).subscribe(result => {this.toastService.remove('/rc/cadastros/setor','Setor');this.activeModal.close('remove') });
        break;
      default:
        this.profileService.deleteProfile(this.view._id).subscribe(result => {this.toastService.remove('','Profile');this.activeModal.close('remove') });
    }

  }

}
