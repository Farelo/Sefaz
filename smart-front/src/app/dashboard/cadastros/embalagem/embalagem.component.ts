import { ChangeDetectionStrategy, Component, OnInit ,ViewChild} from '@angular/core';
import { PackingService, AuthenticationService, FamiliesService } from '../../../servicos/index.service';
import { Packing } from '../../../shared/models/packing';
import { Pagination } from '../../../shared/models/pagination';
import { ModalDeleteComponent } from '../../../shared/modal-delete/modal-delete.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-embalagem',
  templateUrl: './embalagem.component.html',
  styleUrls: ['../cadastros.component.css']
})
export class EmbalagemComponent implements OnInit {
  
  public actualPage = -1;
  private _listOfPackings: any[] = [];
  public listOfPackings: any[] = [];
  public listOfFamilies: any[] = [];
  public selectedFamily: any;

  public logged_user: any;
  
  constructor(
    private packingService: PackingService,
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
    this.loadFamilies();
    this.loadPackings();
  }


  /**
   * Carregar todos os pacotes com paginação e sem filtro
   */
  loadPackings(): void{

    this.packingService.getAllPackings().subscribe(result => {
      this._listOfPackings = result;
      this.listOfPackings = result;
      }, err => {console.log(err)});
  }

  loadFamilies(){
    this.familyService.getAllFamilies().subscribe(result => {
      this.listOfFamilies = result;
    }, err => console.error(err));
  }
  
  /**
   * Proceed to remove a packing
   * @param packing 
   */
  removePacking(packing):void{
    const modalRef = this.modalService.open(ModalDeleteComponent);
    modalRef.componentInstance.mObject = packing;
    modalRef.componentInstance.mType = "PACKING";

    modalRef.result.then((result) => {
      this.loadPackings();
    });
  }


  /**
   * Uma família foi selecionada
   */
  filterChanged(){
    
    if (this.selectedFamily){

      // filter our data
      const temp = this._listOfPackings.filter(item => {
        return item.family !== this.selectedFamily._id;
      });
  
      // update the rows
      this.listOfPackings = temp;
  
      // Whenever the filter changes, always go back to the first page
      this.actualPage = 0;

    } else{
      this._listOfPackings = this._listOfPackings;
    }
  }

}
