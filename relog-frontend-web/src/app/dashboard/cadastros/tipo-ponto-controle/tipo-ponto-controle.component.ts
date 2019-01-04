import { Component, OnInit } from '@angular/core';
import { ControlPointTypesService } from 'app/servicos/index.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDeleteComponent } from 'app/shared/modal-delete/modal-delete.component';

@Component({
  selector: 'app-tipo-ponto-controle',
  templateUrl: './tipo-ponto-controle.component.html',
  styleUrls: ['./tipo-ponto-controle.component.css']
})
export class TipoPontoControleComponent implements OnInit {

  public allTypes: any[] = [];
  public actualPage = -1;
  public search = "";
  public auxAllTypes: any[] = [];

  constructor(
    private controlPointTypesService: ControlPointTypesService,
    private modalService: NgbModal) { }

  ngOnInit() {

    this.loadProjects();
  }

  loadProjects() {
    this.controlPointTypesService
      .getAllTypes()
      .subscribe(data => {

        this.auxAllTypes = data;
        this.allTypes = data;
      },
        err => { console.log(err) });
  }

  pageChanged(page: any): void {

    this.loadProjects();
  }

  removeProject(project): void {
    const modalRef = this.modalService.open(ModalDeleteComponent);
    modalRef.componentInstance.mObject = project;
    modalRef.componentInstance.mType = "PROJECT";

    modalRef.result.then((result) => {
      this.loadProjects();
    });
  }

  searchEvent(event): void {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.auxAllTypes.filter(function (item) {
      return item.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.allTypes = temp;
    // Whenever the filter changes, always go back to the first page
    this.actualPage = 0;
  }
}
