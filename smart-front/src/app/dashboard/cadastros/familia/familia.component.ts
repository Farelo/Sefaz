import { Component, OnInit } from '@angular/core';
import { PackingService, AuthenticationService, CompaniesService } from '../../../servicos/index.service'; 
import { ModalDeleteComponent } from '../../../shared/modal-delete/modal-delete.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FamiliesService } from 'app/servicos/families.service';

@Component({
  selector: 'app-familia',
  templateUrl: './familia.component.html',
  styleUrls: ['../cadastros.component.css']
})
export class FamiliaComponent implements OnInit {
  
  public listOfFamilies: any = [];
  public logged_user: any;
  public actualPage: number = -1; //página atual

  constructor(
    private familyService: FamiliesService,
    private modalService: NgbModal,
    private auth: AuthenticationService) {
      
    let user = this.auth.currentUser();
    
    this.logged_user = (user.supplier ? user.supplier._id : (
      user.official_supplier ? user.official_supplier : (
        user.logistic ? user.logistic.suppliers : (
          user.official_logistic ? user.official_logistic.suppliers : undefined)))); //works fine
  }

  
  searchEvent(): void{
    this.loadListOfFamilies();
  }


  /**
   * Load the list of companies
   */
  loadListOfFamilies(): void{

    this.familyService.getAllFamilies().subscribe(result => {
      this.listOfFamilies = result;
    }, err => console.error(err));
  }

  filterListOfCompanies(){

  }

  /**
   * 
   * @param packing Remove a company
   */
  removePacking(packing):void{
    const modalRef = this.modalService.open(ModalDeleteComponent);
    modalRef.componentInstance.mObject = packing;
    modalRef.componentInstance.mType = "FAMILY";

    modalRef.result.then((result) => {
      this.loadListOfFamilies();
    });
  }


  ngOnInit() {
    
    this.loadListOfFamilies();
  }

}
