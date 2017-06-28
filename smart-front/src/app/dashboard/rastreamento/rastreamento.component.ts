import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DepartmentService } from '../../servicos/departments.service';
import { Department } from '../../shared/models/department';
import { ActivatedRoute } from '@angular/router';
// import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { PackingService } from '../../servicos/packings.service';
import { ModalRastComponent } from '../../shared/modal-rast/modal-rast.component';
declare var $:any;
declare var google: any;

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
    // console.log("antes");
    this.lala();
    // console.log("depois");
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

  lala() {
    var iwOuter = $('.gm-style-iw');
    var iwBackground = iwOuter.prev();
    iwBackground.css({'border' : '1px solid #000'});
    iwBackground.children(':nth-child(2)').css({'display' : 'none'});
    iwBackground.children(':nth-child(4)').css({'display' : 'none'});
    // iwOuter.parent().parent().css({left: '115px'});
    // iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 76px !important;'});
    // iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 76px !important;'});
    // iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index' : '1'});
    var iwCloseBtn = iwOuter.next();

iwCloseBtn.css({
  opacity: '1', // by default the close button has an opacity of 0.7
  right: '55px',
  top: '20px',
  // background-color: 'red', // button repositioning
  // color: 'white',

  });

iwCloseBtn.css({'background-color' : 'red'});
iwCloseBtn.css({'background' : 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAXCAYAAAD3CERpAAAACXBIWXMAAAsSAAALEgHS3X78AAABGklEQVRIx+2W4U3DMBCFv1gZIBtQNsgG0AkoI7BBRjAbZBPKBt4AukG6gTvB488VRZYb4hSChHhSfsTn+PNdni+pJAF0wI6f1WCciKRe6+ldEpUs1RX1WCcDB8AD8RshHfAwum/JlGCQtJPElVcrKWTW9y6zsxvgBdgDmwWZNVatN+AuOyPZxT65j5K6guzurVKpecZjPoVOPdhOwJoLG/YWD19Bz4v4zPvoLTYGdgYYK0jajObMgk6Z4Wy0XCxeMGERdCqbOVXIQt1MR/bm5NdM7ABsP1vcDLmCoxCtP2+BI3ACnoEWCCVnql5wDoOBGmvixaoXtrZ4Tat0/IL+oX8Pmrp3jb+IWEka7Bu6lm6ddZnjCrAT8AQMH3jl/HRbCP5BAAAAAElFTkSuQmCC) no-repeat left center'});
iwCloseBtn.css({'background-size' : '13px'});

iwCloseBtn.children(':nth-child(1)').css({'display' : 'none'});

iwCloseBtn.mouseout(function(){
  $(this).css({opacity: '1'});
});


  }

  funcaoTop(){
    console.log("lalalal");
    google.maps.event.addListener('iw', 'domready', function() {
    var iwOuter = $('.gm-style-iw');
    var iwBackground = iwOuter.prev();
    iwBackground.children(':nth-child(2)').css({'display' : 'none'});
    iwBackground.children(':nth-child(4)').css({'display' : 'none'});
    });
  }
  close(){
   close();
  }
}
