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
  
  public data: any = [];
  public search = "";
  
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
      .subscribe(
        result => this.data = result,
        error => console.error(error)
      )
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
   * Método para paginação
   */
  pageChanged(page: any): void {
    this.data.meta.page = page;
    this.loadCompanies();
  }

  /**
   * Método para busca de ponto de controle
   */
  searchEvent(): void {
    this.loadCompanies();
  }

  


}
