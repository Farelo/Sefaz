import { Component, OnInit } from '@angular/core';
import { Pagination } from '../../../shared/models/pagination';
import { InventoryService, PackingService, AuthenticationService, InventoryLogisticService, FamiliesService, ReportsService } from '../../../servicos/index.service';
import { AbscenseModalComponent } from '../../../shared/modal-packing-absence/abscense.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-inventario-ausencia',
  templateUrl: './inventario-ausencia.component.html',
  styleUrls: ['./inventario-ausencia.component.css']
})
export class InventarioAusenciaComponent implements OnInit {

  public listOfFamilies: any[];
  public selectedFamily: any = null;

  public listOfSerials: any[] = [];
  public selectedSerial: any = null;

  public listOfAbsent: any[] = [];
  public auxListOfAbsent: any[] = [];
  
  public timeInterval: number = null;

  public actualPage: number = -1;

  constructor( 
    private familyService: FamiliesService,
    private reportService: ReportsService,
    private modalService: NgbModal,
    private auth: AuthenticationService) {

  }

  ngOnInit() {

    this.loadFamilies();
    this.loadAbsenceInventory();
  }

  loadFamilies(){
    this.familyService.getAllFamilies().subscribe(result => {

      this.listOfFamilies = result;
    }, err => console.error(err));
  }

  /**
   * Loads the serials
   */
  loadSerials(event: any) {

    this.selectedSerial = null;

    // console.log(aux);
    this.listOfSerials = this.listOfAbsent;
  }

  loadLocals(){

  }

  loadAbsenceInventory() {
    this.reportService.getAbsentInventory().subscribe(result => {
      this.listOfAbsent = result;
      this.auxListOfAbsent = result;
    }, err => { console.log(err) });
  }

  /**
   * Filtros
   */
  familyFilter(event: any){
    console.log(event);
    
    if(!event) {
      this.listOfSerials = [];
      this.selectedSerial = null;
      return;
    }

    let aux = this.auxListOfAbsent.filter(elem => {
      return elem.family.code == event.code;
    });

    this.listOfAbsent = aux;

    this.loadSerials(event);
    //this.intervalFilter();
  }

  serialFilter(event: any) {

    if (!event) {
      this.selectedSerial = null;
      this.familyFilter(this.selectedFamily);
      return;
    }

    let aux = this.auxListOfAbsent.filter(elem => {
      return ((elem.family.code == event.family.code) && (elem.serial == event.serial));
    });

    //console.log(aux);
    this.listOfAbsent = aux;

    this.intervalFilter();
  }

  intervalFilter(){

    console.log(this.timeInterval);
    
    if (this.timeInterval){
      let aux = this.listOfAbsent.filter(elem => {
        return (elem.absent_time_in_hours == this.timeInterval);
      });

      this.listOfAbsent = aux;
    }
  }

  applyGeneralFilter(){

    console.log('apply filter');
    console.log(this.selectedFamily);
    console.log(this.selectedSerial);
    console.log(this.timeInterval);

    let aux = this.auxListOfAbsent.filter(elem => {
      
      let bFamily = (this.selectedFamily == null ? true : (elem.family.code == this.selectedFamily.code));
      let bSerial = (this.selectedSerial == null ? true : (elem.serial == this.selectedSerial.serial));
      let binterval = (this.timeInterval == null ? true : (elem.absent_time_in_hours <= this.timeInterval));

      console.log(`${bFamily}, ${bSerial}, ${binterval}` )

      return (bFamily && bSerial && binterval);
    });

    this.listOfAbsent = aux;
  }


  openAbsence(packing) {
    const modalRef = this.modalService.open(AbscenseModalComponent, { backdrop: "static", size: "lg" });
    modalRef.componentInstance.packing = packing;
  }
  
}
