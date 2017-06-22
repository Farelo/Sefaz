import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DepartmentService } from '../../servicos/departments.service';
import { Department } from '../../shared/models/department';
import { ActivatedRoute } from '@angular/router';
// import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';import { PackingService } from '../../servicos/packings.service';
import { ModalRastComponent } from '../../shared/modal-rast/modal-rast.component';

@Component({
  selector: 'app-rastreamento',
  templateUrl: './rastreamento.component.html',
  styleUrls: ['./rastreamento.component.css']
})
export class RastreamentoComponent implements OnInit {
  autocomplete: any;
  address: any = {};
  center: any;
  pos: any;
  departments: Department[];
  options = [];
  marker = {
    display: true,
    lat: null,
    lng: null,
    plant: null,
    departments: null
  };
  // inscricao: Subscription;
  numero: 1;


  constructor(
    private ref: ChangeDetectorRef,
    private DepartmentService: DepartmentService,
    private PackingService: PackingService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal

  ) { }

  loadDepartmentsByPlant() {
    this.DepartmentService.retrieveByPlants()
      .subscribe(departments => {

        for (let department of departments) {
          var plant = department.plant;
          this.options.push({departments:department.departments,name: plant.name, position: [plant.lat, plant.lng]});
        }

        this.center = { lat: plant.lat, lng: plant.lng };

      }, err => { console.log(err) });
  }

  clicked(_a, opt) {
    var marker = _a.target;

    this.marker.lat = marker.getPosition().lat();
    this.marker.lng = marker.getPosition().lng();
    this.marker.plant = opt.name;
    this.marker.departments = opt.departments;

    marker.nguiMapComponent.openInfoWindow('iw', marker);

  }

  ngOnInit() {

    this.loadDepartmentsByPlant();
  }

  open(id) {
    this.PackingService.getPackingsByDepartment(id).subscribe(packings => {
      const modalRef = this.modalService.open(ModalRastComponent);
        console.log(packings);
      modalRef.componentInstance.packings = packings;
    });

  }

}
