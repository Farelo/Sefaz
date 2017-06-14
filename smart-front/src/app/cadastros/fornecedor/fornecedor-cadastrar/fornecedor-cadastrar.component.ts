import { Component, OnInit } from '@angular/core';
import { SuppliersService } from '../../../servicos/suppliers.service';;
import { Supplier } from '../../../shared/models/supplier';
import { PlantsService } from '../../../servicos/plants.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fornecedor-cadastrar',
  templateUrl: './fornecedor-cadastrar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class FornecedorCadastrarComponent implements OnInit {

  constructor(
    private PlantsService: PlantsService,
    private SuppliersService: SuppliersService,
    private router: Router
  ) { }

  plants =  [];
  supplier:  Supplier = new Supplier({plant:""});

  registerSupplier():void {

    this.SuppliersService.createSupplier(this.supplier).subscribe( result => this.router.navigate(['/cadastros/fornecedor']) );
  }

  loadPlants():void {
    this.PlantsService.retrieveAll().subscribe( result => this.plants = result );
  }

  ngOnInit() {
    this.loadPlants();
  }

}
