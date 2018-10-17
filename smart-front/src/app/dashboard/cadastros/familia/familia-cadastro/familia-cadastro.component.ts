import { Component, OnInit } from '@angular/core';
import { ToastService, PackingService } from '../../../../servicos/index.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Family } from 'app/shared/models/family';

@Component({
  selector: 'app-familia-cadastro',
  templateUrl: './familia-cadastro.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class FamiliaCadastroComponent implements OnInit {
  public mFamily : FormGroup; 

  constructor( 
    private PackingService: PackingService,  
    private toastService: ToastService,
    private fb: FormBuilder) { }
  
  ngOnInit() {
    this.mFamily = this.fb.group({
      code: ['', [Validators.required]]
    });
  }

  onSubmit({ value, valid }: { value: Family, valid: boolean }): void {

    console.log('code: ' + JSON.stringify(value));
    
    //value.code = this.mFamily.controls.code.value;

    if (this.mFamily.valid){

      console.log('valid code');
      //this.finishRegister(value);
    }
  }

  finishRegister(value){
    this.PackingService.createPacking([value]).subscribe( result => {
      this.toastService.success('/rc/cadastros/family', 'Embalagem');
    }, err => this.toastService.error(err) );
  }

}
