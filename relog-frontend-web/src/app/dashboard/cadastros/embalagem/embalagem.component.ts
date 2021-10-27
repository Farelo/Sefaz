import { Component, OnInit, Input } from '@angular/core';
import { RackService, AuthenticationService, FamiliesService } from '../../../servicos/index.service'; 
import { Pagination } from '../../../shared/models/pagination';
import { ModalDeleteComponent } from '../../../shared/modal-delete/modal-delete.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-embalagem',
  templateUrl: './embalagem.component.html',
  styleUrls: ['../cadastros.component.css']
})
export class EmbalagemComponent implements OnInit {
  
  //list
  private _listOfRacks: any[] = [];
  public listOfRacks: any[] = [];
  
  //ng select
  public listOfFamilies: any[] = [];
  public selectedFamily: any;
  
  //pagination
  public actualPage = -1;

  public logged_user: any;
  
  constructor(
    private rackService: RackService,
    private familyService: FamiliesService,
    private modalService: NgbModal,
    private auth: AuthenticationService) {

    let user = this.auth.currentUser(); 
    
    this.logged_user = (user.supplier ? user.supplier._id : (
      user.official_supplier ? user.official_supplier : (
        user.logistic ? user.logistic.suppliers : (
          user.official_logistic ? user.official_logistic.suppliers : undefined)))); //works fine
  }


  ngOnInit() {
    //this.loadFamilies();
    this.loadRacks();
  }


  /**
   * Carregar todos os pacotes com paginação e sem filtro
   */
  loadRacks(): void{

    this.rackService.getAllRacks().subscribe(result => {

      this._listOfRacks = result;
      this.listOfRacks = result;
      }, err => {console.log(err)});
  }

  loadFamilies(){
    this.familyService.getAllFamilies().subscribe(result => {
      this.listOfFamilies = result;
    }, err => console.error(err));
  }
  
  /**
   * Proceed to remove a rack
   * @param rack 
   */
  removeRack(rack):void{
    const modalRef = this.modalService.open(ModalDeleteComponent);
    modalRef.componentInstance.mObject = rack;
    modalRef.componentInstance.mType = "RACK";

    modalRef.result.then((result) => {
      this.loadRacks();
    });
  }


  searchEvent(event): void {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this._listOfRacks.filter(function (item) {
      return ((item.family.code.toLowerCase().indexOf(val) !== -1 || !val)
              || (item.serial.toLowerCase().indexOf(val) !== -1 || !val)
              || (item.tag.code.toLowerCase().indexOf(val) !== -1 || !val));
    });

    // update the rows
    this.listOfRacks = temp;
    // Whenever the filter changes, always go back to the first page
    this.actualPage = 0;
  }

}
