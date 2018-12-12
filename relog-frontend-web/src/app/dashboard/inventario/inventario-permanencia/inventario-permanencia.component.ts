import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Pagination } from '../../../shared/models/pagination'; 
import { InventoryService, PackingService, AuthenticationService, ReportsService, FamiliesService } from '../../../servicos/index.service';

@Component({
  selector: 'app-inventario-permanencia',
  templateUrl: './inventario-permanencia.component.html',
  styleUrls: ['./inventario-permanencia.component.css']
})
export class InventarioPermanenciaComponent implements OnInit {

  public listOfPermanence: any[] = []; 
  public auxListOfPermanence: any[] = []; 

  public listOfFamilies: any[] = [];  
  public selectedFamily: any = null;
  
  public listOfSerials: any[] = [];  
  public selectedSerial: any = null;

  public actualPage: number = -1;

  constructor(
    private reportService: ReportsService,
    private familyService: FamiliesService,
    private auth: AuthenticationService) {

  }

  ngOnInit() {
    this.loadPackings();
    this.permanenceInventory();
  }
  
  /**
   * Default list
   */
  permanenceInventory() {
    this.reportService.getPermanenceInventory().subscribe(result => {
      this.listOfPermanence = result; 
      this.auxListOfPermanence = result; 
    }, err => { console.log(err) });
  }

  /**
   * Loading the families
   */
  loadPackings() {
    this.familyService.getAllFamilies().subscribe(result => {

      this.listOfFamilies = result; 
    }, err => console.error(err));
  }

  /**
   * A family was selected
   */
  familyFilter(event: any){
    console.log(event);

    if(!event) {
      this.listOfPermanence = this.auxListOfPermanence;
      this.selectedFamily = null;

      this.selectedSerial = null;
      this.listOfSerials = [];
      return;
    }

    this.listOfPermanence = this.auxListOfPermanence.filter(elem => {
      return elem.family_code == event.code;
    });

    this.loadSerials(event);
  }

  /**
   * Loads the serials
   */
  loadSerials(event: any){

    this.selectedSerial = null;
    
    let aux = this.listOfPermanence.filter(elem =>{
      return elem.family_code == event.code;
    });

    // console.log(aux);
    this.listOfSerials = aux;
  }

  /**
   * A serial was selected
   */
  serialFilter(event: any) {
    
    if (!event) {
      this.selectedSerial = null;
      this.familyFilter(this.selectedFamily);
      return;
    }

    let aux = this.auxListOfPermanence.filter(elem => {
      return ((elem.family_code == event.family_code) && (elem.serial == event.serial));
    });

    //console.log(aux);
    this.listOfPermanence = aux;
  }

}
