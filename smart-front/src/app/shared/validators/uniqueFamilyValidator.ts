import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from "@angular/forms";
import { FamiliesService } from "app/servicos/index.service";

/**
 * Form Validator for "confirm password"
 */
@Injectable()
export class UniqueFamilyValidation {

  // static uniqueFamily(control: AbstractControl): ValidationErrors | null {
    
    // constructor(private familyService: FamiliesService){

    // }
    
    // console.log('uniqueFamily');
    
    // return new Promise((resolve, reject) => {
    //   //let familyService: FamiliesService = new FamiliesService(new HttpClient());

    //   this.familyService.getAllFamilies({ code: 'LTR-06' }).subscribe(result => {
    //     if(result.length > 0)
    //       resolve({ uniqueFamily: true });
    //     else
    //       resolve(null);
    //   }, err => console.error(err));
    // });
  }
}