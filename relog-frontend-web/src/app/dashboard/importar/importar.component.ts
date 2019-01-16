import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import * as Handsontable from 'handsontable/dist/handsontable.full.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DepartmentService, RoutesService, PackingService, ToastService, PlantsService, ProjectService, TagsService, ImportService, ControlPointsService, CompaniesService } from '../../servicos/index.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-importar',
  templateUrl: './importar.component.html',
  styleUrls: ['./importar.component.css']
})
export class ImportarComponent implements OnInit {

  private importResult: any = {};
  public file: any;
  public fileName: string;
  public uploader = [];   //usado para imprimir metadados do arquivo no front
  public send = false;
  public activeModal: any;
  public import: FormGroup;
 ;

  constructor(
    private modalService: NgbModal,
    private importService: ImportService,
    private packingService: PackingService,
    private companyService: CompaniesService,
    private controlPoints: ControlPointsService, 
    private toastService: ToastService,
    private fb: FormBuilder) { }

  public ngOnInit() {
    this.import = this.fb.group({
      type: ['', [Validators.required]],
    });
    this.import['controls'].type.setValue("");
  }

  remove() {
    this.uploader.pop();
    console.log(this.uploader);
    this.send = false;
  }

  fileEvent(fileInput: any) {
    const files = fileInput.target.files || fileInput.srcElement.files;
    const file = files[0];
    const formData = new FormData();
    formData.append('control_point_xlsx', file);
    this.file = formData;
    if (this.uploader.length != 0 && file) this.uploader.pop()
    if (file) this.uploader.push(file);

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

        case 'Empresas':
          this.sendCompanies();
          break;
      }
    }
  }


  sendPackings() {
    this.importService.sendDataToImportPacking(this.file).subscribe(res => {
      this.send = true;
      this.importResult = res;
    }, err => this.toastService.errorArray(err));
  }

  sendControlPoints() {
    this.importService.sendDataToImportControlPoint(this.file).subscribe(res => {
      this.send = true;
      this.importResult = res;
    }, err => this.toastService.errorArray(err));
  }

  sendCompanies() {
    this.importService.sendDataToImportCompany(this.file).subscribe(res => {
      this.send = true;
      this.importResult = res;
    }, err => this.toastService.errorArray(err));
  }

  /**
   * There is no correspondent objects in the database.
   * Do you want register them?
   */
  register() {

    switch (this.import['controls'].type.value) {
      case 'Embalagens':
        this.packingService.createPackingArray(this.importResult.to_register).subscribe(result => { 
          this.send = false; 
          this.toastService.successArray('', 'Embalagens') 
        }, err => this.toastService.errorArray(err));
        break;

      case 'Pontos de Controle':
        this.controlPoints.createControlPointArray(this.importResult.to_register).subscribe(result => { 
          this.send = false; 
          this.toastService.successArray('', 'Pontos de Controle') 
        }, err => this.toastService.errorArray(err));
        break;

      case 'Empresas':
        this.companyService.createCompanyArray(this.importResult.to_register).subscribe(result => { 
          this.send = false; 
          this.toastService.successArray('', 'Empresas') 
        }, err => this.toastService.errorArray(err));
        break;
    }
  }

  /**
   * Miscelaneous
   */

  openHelp(content) {
    this.activeModal = this.modalService.open(content, { size: "lg" });
  }

  /**
   * MEthod to convert an array into string
   * @param mArray 
   */
  arrayToString(mArray: any[]) {
    let result = '';
    mArray.map(elem => {
      result = JSON.stringify(mArray);
    });
    return result;
  }
  
}
