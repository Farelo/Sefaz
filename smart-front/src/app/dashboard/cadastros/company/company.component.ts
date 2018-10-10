import { Component, OnInit } from '@angular/core';
import { Pagination } from '../../../shared/models/pagination';
import { RoutesService } from '../../../servicos/index.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['../cadastros.component.css']
})
export class CompanyComponent implements OnInit {
  
  public data: any = [];
  public search = "";
  
  constructor(private RoutesService: RoutesService,
    private modalService: NgbModal) { }

  ngOnInit() {

    this.loadPoints();
  }

  /**
   * Método para carregar a lista
   */
  loadPoints() {

  }

  /**
   * Click no botão excluir
   * @param route Rota a ser removida
   */
  removePoint(route): void {

  }

  /**
   * Método para paginação
   */
  pageChanged(page: any): void {
    this.data.meta.page = page;
    this.loadPoints();
  }

  /**
   * Método para busca de ponto de controle
   */
  searchEvent(): void {
    this.loadPoints();
  }

  


}
