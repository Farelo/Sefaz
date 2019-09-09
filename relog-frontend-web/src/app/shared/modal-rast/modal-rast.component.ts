import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from '../../shared/models/pagination';
import { PackingService } from '../../servicos/index.service';

@Component({
  selector: 'app-modal-rast',
  templateUrl: './modal-rast.component.html',
  styleUrls: ['./modal-rast.component.css']
})
export class ModalRastComponent implements OnInit {
  @Input() department;
  public data: Pagination = new Pagination({meta: {page : 1}});

  constructor(
    public activeModal: NgbActiveModal,
    private packingService: PackingService
  ) { }

  ngOnInit() {
    this.getPackings();
  }

  getPackings(){
    this.packingService.getPackingsByDepartment(this.department, 10, this.data.meta.page).subscribe(result => this.data = result);
  }

  pageChanged(page: any): void{
    this.data.meta.page = page;
    this.getPackings();
  }

}