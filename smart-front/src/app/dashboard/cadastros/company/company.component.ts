import { Component, OnInit } from '@angular/core';
import { CompaniesService } from '../../../servicos/companies.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../servicos/index.service';
import { ModalDeleteComponent } from 'app/shared/modal-delete/modal-delete.component';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['../cadastros.component.css']
})
export class CompanyComponent implements OnInit {
  
  public listOfCompanies: any = [];
  public auxListOfCompanies: any = [];

  public search = "";
  public actualPage = -1;
  
  constructor( 
    private modalService: NgbModal,
    protected companiesService: CompaniesService,
    protected toastService: ToastService ) { }

  ngOnInit() {
    this.loadCompanies();
  }

  /**
   * Método para carregar a lista
   */
  loadCompanies() {
    this.companiesService
      .getAllCompanies()
      .subscribe(result => {

        this.listOfCompanies = result;
        this.auxListOfCompanies = result;
      },error => console.error(error))
  }

  /**
   * Click no botão excluir
   * @param route Rota a ser removida
   */
  removeCompany(company: any) {
    
    const modalRef = this.modalService.open(ModalDeleteComponent);
    modalRef.componentInstance.mObject = company;
    modalRef.componentInstance.mType = "COMPANY";

    modalRef.result.then((result) => {
      this.loadCompanies();
    });
  }

  /**
   * Método para busca de ponto de controle
   */
  searchEvent(event): void {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.auxListOfCompanies.filter(function (item) {
      return ((item.name.toLowerCase().indexOf(val) !== -1 || !val)
              || (item.phone.toLowerCase().indexOf(val) !== -1 || !val));
    });

    // update the rows
    this.listOfCompanies = temp;

    // Whenever the filter changes, always go back to the first page
    this.actualPage = 0;
  }
  
}
