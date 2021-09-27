import { Component, OnInit } from '@angular/core';
import { RackService, AuthenticationService, CompaniesService } from '../../../servicos/index.service'; 
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
  public auxListOfFamilies: any = [];
  public logged_user: any;
  public actualPage: number = -1; //página atual

  constructor(
    private familyService: FamiliesService,
    private modalService: NgbModal,
    private auth: AuthenticationService) {
  
  }


  /**
   * Load the list of companies
   */
  loadListOfFamilies(): void{

    this.familyService.getAllFamilies().subscribe(result => {
      
      this.listOfFamilies = result;
      this.auxListOfFamilies = result;
    }, err => console.error(err));
  }

  searchEvent(event): void {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.auxListOfFamilies.filter(function (item) {
      return item.code.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.listOfFamilies = temp;
    // Whenever the filter changes, always go back to the first page
    this.actualPage = 0;
  }

  /**
   * 
   * @param rack Remove a company
   */
  removeRack(rack):void{
    const modalRef = this.modalService.open(ModalDeleteComponent);
    modalRef.componentInstance.mObject = rack;
    modalRef.componentInstance.mType = "FAMILY";

    modalRef.result.then((result) => {
      this.loadListOfFamilies();
    });
  }


  ngOnInit() {
    
    this.loadListOfFamilies();
  }

}
