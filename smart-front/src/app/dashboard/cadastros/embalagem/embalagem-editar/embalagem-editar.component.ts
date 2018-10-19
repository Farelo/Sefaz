import { Component, OnInit } from '@angular/core'; 
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService, PackingService, FamiliesService } from '../../../../servicos/index.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-embalagem-editar',
  templateUrl: './embalagem-editar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class EmbalagemEditarComponent implements OnInit {
  
  public mPacking: FormGroup;
  public listOfFamilies: any[] = [];
  public inscricao: Subscription;
  public mId: string;
  
  constructor(
    private familyService: FamiliesService,
    private packingService: PackingService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder) { }

  ngOnInit() {

    this.configureForm();
    this.loadFamilies();
    this.retrieveUser();
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }): void {

    value.family = value.family._id;

    console.log('value:');
    console.log(JSON.stringify(value));

    if (valid) {
      this.finishUpdate(value);
    }
  }

  loadFamilies() {
    this.familyService.getAllFamilies().subscribe(result => {
      this.listOfFamilies = result;
    }, err => console.error(err));
  }

  retrieveUser() {
    this.inscricao = this.route.params.subscribe((params: any) => {
      this.mId = params['id'];
      this.packingService.getPacking(this.mId).subscribe(result => {

        //console.log('result ...' + JSON.stringify(result));
        (<FormGroup>this.mPacking).patchValue(result, { onlySelf: true });
      });
    });
  }

  finishUpdate(value) {
    this.packingService.editPacking(this.mId, value)
      .subscribe(result => {
        this.toastService.success('/rc/cadastros/embalagem', 'Embalagem');
      });
  }


  configureForm() {
    this.mPacking = this.fb.group({
      tag: this.fb.group({
        code: ['', [Validators.required]],
        version: ['', [Validators.required]],
        manufactorer: ['', [Validators.required]]
      }),
      serial: ['', [Validators.required]],
      type: ['', [Validators.required]],
      weigth: ['', [Validators.required]],
      width: ['', [Validators.required]],
      heigth: ['', [Validators.required]],
      length: ['', [Validators.required]],
      capacity: ['', [Validators.required]],
      family: ['', [Validators.required]],
      observations: ''
    });
  }
  
}
