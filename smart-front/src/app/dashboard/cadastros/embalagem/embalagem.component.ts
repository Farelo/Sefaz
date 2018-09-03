import { ChangeDetectionStrategy, Component, OnInit ,ViewChild} from '@angular/core';
import { PackingService, AuthenticationService } from '../../../servicos/index.service';
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
  public data: Pagination = new Pagination({meta: {page : 1}});
  public search  = "";

  public logged_user: any;
  public packings: any[];
  public generalEquipamentSearch = "";

  constructor(
    private packingService: PackingService,
    private PackingService : PackingService,
    private modalService: NgbModal,
    private auth: AuthenticationService) {

    let user = this.auth.currentUser();
    let current_user = this.auth.currentUser();
    
    this.logged_user = (user.supplier ? user.supplier._id : (
      user.official_supplier ? user.official_supplier : (
        user.logistic ? user.logistic.suppliers : (
          user.official_logistic ? user.official_logistic.suppliers : undefined)))); //works fine
  }

  
  searchEvent(): void{
    this.loadPackings();
  }


  /**
   * Carregar todos os pacotes com paginação e sem filtro
   */
  loadPackings(): void{

    this.PackingService
      .getPackingsPagination(10,this.data.meta.page,this.search)
      .subscribe(result => {
        this.data = result;
      }, err => {console.log(err)});
  }

  
  removePacking(packing):void{
    const modalRef = this.modalService.open(ModalDeleteComponent);
    modalRef.componentInstance.view = packing;
    modalRef.componentInstance.type = "packing";

    modalRef.result.then((result) => {
      if(result === "remove") this.loadPackings();
    });

  }


  ngOnInit() {
    this.loadSelect();
    this.loadPackings();
  }


  /**
   * Preencher o select de equipamentos
   */
  loadSelect(){
    if (this.logged_user instanceof Array) {
      this.packingService.getPackingsDistinctsByLogistic(this.logged_user).subscribe(result => this.packings = result.data, err => { console.log(err) });

    } else if (this.logged_user) {
      this.packingService.getPackingsDistinctsBySupplier(this.logged_user).subscribe(result => this.packings = result.data, err => { console.log(err) });

    } else {
      this.packingService.getPackingsDistincts().subscribe(result => {
        this.packings = result.data;
        console.log('this.packings: ' + JSON.stringify(this.packings));
      }, err => { console.log(err) });
    }
  }


  /**
   * Um Equipamento foi selecionado
   */
  equipamentChanged(){
    
    //Quando um equipamento está selecionado
    if (this.generalEquipamentSearch){
      console.log('.equipamentChanged if this.generalEquipamentSearch: ' + JSON.stringify(this.generalEquipamentSearch));
      this.packingService.getPackingsByPackingCode(this.generalEquipamentSearch, 10, this.data.meta.page).subscribe(result => {
        
        result.meta = {
          page: result.data.page,
          limit: result.data.limit,
          total_pages: result.data.pages,
          total_docs: result.data.total
        };

        result.data = result.data.docs;

        //console.log('.generalInventoryEquipamentChanged ...result: ' + JSON.stringify(result));

        // this.general_equipament = new Pagination({ meta: { page: 1 } });
        this.data = result;

        console.log('.equipamentChanged this.data: ' + JSON.stringify(this.data));
      }, err => { console.log(err) });

    //Quando um equipamento foi deselecionado (clear)
    }else{
      console.log('..equipamentChanged else this.generalEquipamentSearch: ' + JSON.stringify(this.generalEquipamentSearch));

      //this.data = new Pagination({ meta: { page: 1 } });
      //this.generalEquipamentSearch = "";
      //this.data.data = [];
      this.loadPackings();
    }
  }


  /**
   * 
   * @param Mudou a paginação
   */
  pageChanged(page: any): void {
    this.data.meta.page = page;

    this.equipamentChanged();
  }

}
