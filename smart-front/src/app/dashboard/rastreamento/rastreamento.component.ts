import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DepartmentService } from '../../servicos/departments.service';
import { Department } from '../../shared/models/department';
import { PackingService } from '../../servicos/packings.service';

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

  constructor(
    private ref: ChangeDetectorRef,
    private DepartmentService: DepartmentService,
    private PackingService: PackingService
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

  getPackings(id){
    this.PackingService.getPackingsByDepartment(id).subscribe(departments => console.log(departments));
  }

  ngOnInit() {
    this.loadDepartmentsByPlant();
  }

}
