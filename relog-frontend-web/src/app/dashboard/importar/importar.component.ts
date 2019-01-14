import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import * as Handsontable from 'handsontable/dist/handsontable.full.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DepartmentService, RoutesService, PackingService, ToastService, PlantsService, ProjectService, TagsService, ImportService } from '../../servicos/index.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-importar',
  templateUrl: './importar.component.html',
  styleUrls: ['./importar.component.css']
})
export class ImportarComponent implements OnInit {

  private importResult: any = { };
  private type = "";
  private colHeaders: string[];
  private columns: any[];
  public file: any;       //blob
  public fileName: string;
  public uploader = [];   //usado para imprimir metadados do arquivo no front
  public send = false;
  public activeModal: any;
  public import: FormGroup;
  private options = {
    rowHeaders: true,
    stretchH: 'all',
    columnSorting: true,
    contextMenu: true,
  };

  constructor(
    private modalService: NgbModal,
    private importService: ImportService,
    private packingService: PackingService,
    private toastService: ToastService,
    private tagsService: TagsService,
    private routeService: RoutesService,
    private plantsService: PlantsService,
    private projectService: ProjectService,
    private departmentService: DepartmentService,
    private fb: FormBuilder) { }

  public ngOnInit() {
    this.import = this.fb.group({
      type: ['', [Validators.required]],
    });
    this.import['controls'].type.setValue("");
    //this.editTable();
  }

  // editTable() {
  //   var iwa = $('.classeDoCacete');
  //   var hottable = iwa.children(':nth-child(1)');
  //   var hand = hottable.children(':nth-child(1)');
  //   var htmaster = hand.children(':nth-child(1)');
  //   var wtholder = htmaster.children(':nth-child(1)');
  //   var wthilder = wtholder.children(':nth-child(1)');

  //   var he = wthilder.height();
  //   wtholder.css({ 'height': he });
  //   hottable.css({ 'height': he });
  // }

  remove() {
    this.uploader.pop();
    console.log(this.uploader);
    this.send = false;
  }

  fileEvent(fileInput: any) {
    const files = fileInput.target.files || fileInput.srcElement.files;
    const file = files[0];
    const formData = new FormData();
    formData.append('upfile', file);
    this.file = formData;
    if (this.uploader.length != 0 && file) this.uploader.pop()
    if (file) this.uploader.push(file);

    console.log(this.uploader);
    this.send = false;
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }): void {

    if (valid) {
      switch (value.type) {
        case 'Embalagens':
          this.sendPackings();
          break;

        case 'Pontos de Controle':
          this.sendControlPoints();
          break;
      }
    }
  }


  sendPackings() {
    this.importService.sendDataToImportPacking(this.file).subscribe(res => {
      this.send = true;
      this.importResult = res;
      this.colHeaders = ['Nome'];
      this.columns = [
        { data: 'data.name', type: 'text' },
      ];
    }, err => this.toastService.errorArray(err));
  }

  sendControlPoints() {

  }

  /**
   * There is no correspondent objects in the database.
   * Do you want register them?
   */
  register() {

    switch (this.import['controls'].type.value) {
      case 'Embalagens':
        this.packingService.createPackingArray(this.importResult.datas).subscribe(result => { this.send = false; this.toastService.successArray('', 'Embalagens') }, err => this.toastService.errorArray(err));
        break;

      case 'Embalagens':
        this.packingService.createPackingArray(this.importResult.datas).subscribe(result => { this.send = false; this.toastService.successArray('', 'Embalagens') }, err => this.toastService.errorArray(err));
        break;
    }
  }

  openHelp(content) {
    this.activeModal = this.modalService.open(content, { size: "lg" });
  }

  // sendProjects(){
  //   this.importService.sendDataToImportProject(this.file).subscribe(res => {
  //     this.send = true;
  //     this.importResult = res.data;
  //     this.colHeaders = ['Nome'];
  //     this.columns = [
  //       {data: 'name', type: 'text'},
  //     ];
  //   },err => this.toastService.errorArray(err));
  // }

  // sendPlants(){
  //   this.importService.sendDataToImportPlant(this.file).subscribe(res => {
  //     this.send = true;
  //     this.importResult = res.data;
  //     this.colHeaders = ['Nome','Latitude','Longitude','Localidade'];
  //     this.columns = [
  //       {data: 'plant_name', type: 'text'},
  //       { data: 'lat', type: 'numeric', numericFormat: { pattern: '0.[0000000000]' } },
  //       { data: 'lng', type: 'numeric', numericFormat: { pattern: '0.[0000000000]' } },
  //       {data: 'location', type: 'text'},
  //     ];
  //   },err => this.toastService.errorArray(err));
  // }

  // sendDepartment(){
  //   this.importService.sendDataToImportDepartment(this.file).subscribe(res => {
  //     this.send = true;
  //     this.importResult = res.data;

  //     this.colHeaders = ['Nome','Latitude','Longitude','Planta'];
  //     this.columns = [
  //       {data: 'name', type: 'text'},
  //       { data: 'lat', type: 'numeric', numericFormat: { pattern: '0.[0000000000]' }},
  //       { data: 'lng', type: 'numeric', numericFormat: { pattern: '0.[0000000000]' }},
  //       {data: 'plant.plant_name', type: 'text', readOnly: true},
  //     ];
  //   },err => this.toastService.errorArray(err));
  // }

  // sendPacking(){

  //   this.importService.sendDataToImportPacking(this.file).subscribe(res => {
  //     this.send = true;
  //     this.importResult = res.data;

  //     this.colHeaders = ['Código','Serial','Tag','Descrição','Fornecedor', 'DUNS', 'Capacidade', 'Peso', 'Largura', 'Altura','Projeto'];
  //     this.columns = [
  //       {data: 'code', type: 'text'},
  //       {data: 'serial', type: 'text'},
  //       {data: 'tag.code', type: 'text', readOnly: true},
  //       {data: 'type', type: 'text'},
  //       {data: 'supplier.name', type: 'text', readOnly: true},
  //       {data: 'supplier.duns', type: 'text', readOnly: true},
  //       { data: 'capacity', type: 'numeric', numericFormat: { pattern: '0.[00]' }},
  //       { data: 'weigth', type: 'numeric', numericFormat: { pattern: '0.[00]' }},
  //       { data: 'width', type: 'numeric', numericFormat: { pattern: '0.[00]' }},
  //       { data: 'heigth', type: 'numeric', numericFormat: { pattern: '0.[00]' }},
  //       {data: 'project.name', type: 'text', readOnly: true}
  //     ];

  //   },err => this.toastService.errorArray(err));
  // }

  // sendRoute(){

  //   this.importService.sendDataToImportRoute(this.file).subscribe(res => {
  //     this.send = true;
  //     this.importResult = res.data;
  //     console.log(this.importResult);
  //     this.colHeaders = ['Fornecedor','DUNS','Embalagem','Planta do Fornecedor', 'Planta da Fábrica','Origem', 'Destino'];
  //     this.columns = [
  //       {data: 'supplier.name', type: 'text', readOnly: true},
  //       {data: 'supplier.duns', type: 'text', readOnly: true},
  //       {data: 'packing_code', type: 'text'},
  //       {data: 'plant_supplier.plant_name', type: 'numeric'},
  //       {data: 'plant_factory.plant_name', type: 'numeric'},
  //       {data: 'location.start_address', type: 'text'},
  //       {data: 'location.end_address', type: 'text'}

  //     ];
  //   },err => this.toastService.errorArray(err));
  // }

}
