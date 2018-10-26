import { Component, OnInit } from '@angular/core';
import { ControlPointsService } from 'app/servicos/index.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDeleteComponent } from 'app/shared/modal-delete/modal-delete.component';
import { MySorter } from 'app/shared/util/mySorter';

@Component({
  selector: 'app-ponto-de-controle',
  templateUrl: './ponto-de-controle.component.html',
  styleUrls: ['../cadastros.component.css']
})
export class PontoDeControleComponent implements OnInit {

  public auxListOfControlPoints: any[] = [];
  public listOfControlPoints: any[] = [];
  public search = "";

  public actualPage: number = 1; //página atual

  constructor(
    private controlPointsService: ControlPointsService,
    private modalService: NgbModal) { }


  ngOnInit() {
    this.loadTableHeaders();
    this.loadControlPoints();
  }


  loadControlPoints() {
    this.controlPointsService
      .getAllControlPoint()
      .subscribe(result => {
        this.auxListOfControlPoints = result;
        this.listOfControlPoints = MySorter.sort(result, ['code']);
      }, err => { console.log(err) });
  }

  removeControlPoint(controlPoint): void {

    const modalRef = this.modalService.open(ModalDeleteComponent);
    modalRef.componentInstance.mObject = controlPoint;
    modalRef.componentInstance.mType = "CONTROL_POINT";

    modalRef.result.then((result) => {
      this.loadControlPoints();
    });
  }

  searchEvent(event): void {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.auxListOfControlPoints.filter(function (item) {
      return item.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.listOfControlPoints = temp;
    // Whenever the filter changes, always go back to the first page
    this.actualPage = 0;
  }


  /**
   * ================================================
   * Ordenação
   */
  public headers: any = [];
  public sortStatus: any = ['asc', 'desc'];
  public sort: any = {
    name: '',
    order: ''
  };

  loadTableHeaders() {
    this.headers.push({ label: 'Ponto de controle', name: 'name' });
  }

  headerClick(item: any) {
    this.sort.name = item.name;
    this.sort.order = this.sortStatus[(this.sortStatus.indexOf(this.sort.order) + 1) % 2];

    // console.log('---');
    // console.log('this.sort: ' + JSON.stringify(this.sort));

    this.listOfControlPoints = MySorter.sort(this.listOfControlPoints, item.name.split("."), this.sort.order);
  }


  /**
   * 
   * @param array     All items.
   * @param keyArr    Array with attribute path, if exists.
   * @param reverse   optional. 1 if ascendent, -1 else.
   */
  // customSort(array: any[], keyArr: any[], reverse = 'asc') {
  //   var sortOrder = 1;
  //   if (reverse == 'desc') sortOrder = -1;

  //   console.log('array.length: ' + array.length);
  //   console.log('keyArr: ' + keyArr);
  //   console.log('sortOrder: ' + sortOrder);

  //   return array.sort(function (a, b) {
  //     var x = a, y = b;
  //     for (var i = 0; i < keyArr.length; i++) {
  //       x = x[keyArr[i]];
  //       y = y[keyArr[i]];
  //     }
  //     return sortOrder * ((x < y) ? -1 : ((x > y) ? 1 : 0));
  //   });
  // }

}
