import { Component, OnInit } from '@angular/core';
import { Pagination } from '../../../shared/models/pagination';
import { RoutesService } from '../../../servicos/index.service';
import { CompaniesService } from '../../../servicos/companies.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../servicos/index.service';
import { Router } from "@angular/router";


@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['../cadastros.component.css']
})
export class CompanyComponent implements OnInit {
  
  public data: any = [];
  public search = "";
  
  constructor(
    private RoutesService: RoutesService,
    private modalService: NgbModal,
    protected companiesService: CompaniesService,
    protected toastService: ToastService,
    private router: Router) { }

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
    this.companiesService
      .deleteCompany(company._id)
      .subscribe(res => { 
        this.toastService.remove('','Empresa', true); 
        this.loadCompanies();
      });
    //this.router.navigate(['/rc/cadastros/company']); })
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
