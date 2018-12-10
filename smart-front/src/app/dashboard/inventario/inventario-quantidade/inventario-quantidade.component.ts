import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../servicos/auth.service';
import { ReportsService, FamiliesService } from '../../../servicos/index.service';
import { Pagination } from '../../../shared/models/pagination';

@Component({
  selector: 'app-inventario-quantidade',
  templateUrl: './inventario-quantidade.component.html',
  styleUrls: ['./inventario-quantidade.component.css'],
})
export class InventarioQuantidadeComponent implements OnInit {
  
  //dados da tabela
  public listOfQuantity: any[] = [];
  public auxListOfQuantity: any[] = [];

  //paginação
  public listOfQuantityActualPage: number = -1;

  //dados do select
  public listOfFamily: any[] = [];
  public selectedFamily: any = null;

  public qtdTotal: number = 0;

  constructor(private reportService: ReportsService,
    private familyService: FamiliesService,
    private auth: AuthenticationService) {

  }

  ngOnInit() {

    this.loadFamilies();
    this.loadQuantityInventory();
  }

  loadFamilies() {
    this.familyService.getAllFamilies().subscribe(result => {
      this.listOfFamily = result;
    }, err => console.error(err));
  }

  loadQuantityInventory() {
    this.reportService.getQuantityInventory().subscribe(result => {
      
      //atualizar dados
      this.listOfQuantity = result;
      this.auxListOfQuantity = result;

      //atualizar quantidades
      this.updateResumeQuantity();
    });
  }

  familySelected(event: any) {

    if (event) {
      this.listOfQuantity = this.auxListOfQuantity.filter(elem => {
        return elem.family_code == event.code
      });

    } else {
      this.listOfQuantity = this.auxListOfQuantity;
    }
    
    this.updateResumeQuantity();
  }

  updateResumeQuantity(){
    this.qtdTotal = this.listOfQuantity.map(elem => elem.total).reduce(function (accumulator, currentValue) { return accumulator + currentValue }, 0);
  }
}
