import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  ToastService,
  RackService,
  FamiliesService,
  ProjectService,
} from "../../../../servicos/index.service";
import {
  FormGroup,
  Validators,
  FormBuilder,
  AbstractControl,
} from "@angular/forms";

@Component({
  selector: "app-embalagem-cadastro",
  templateUrl: "./embalagem-cadastro.component.html",
  styleUrls: ["../../cadastros.component.css"],
})
export class EmbalagemCadastroComponent implements OnInit {
  public mRack: FormGroup;
  public listOfFamilies: any[] = [];
  public listOfProjects: any[] = [];
  public activeRack: boolean = false;
  public deviceModel: any[] = [];

  constructor(
    private familyService: FamiliesService,
    private rackService: RackService,
    private projectService: ProjectService,
    private toastService: ToastService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.configureForm();
    this.loadFamilies();
    this.loadProjects();
    this.fillSelectType();
  }

  fillSelectType() {
    this.deviceModel = [
      { label: "Loka V2", name: "loka" },
      { label: "ALPS Lykaner", name: "alps" },
      { label: "Ayga WACS", name: "ayga" },
    ];
  }

  /**
   * Load the families in the select
   */
  loadFamilies() {
    this.familyService.getAllFamilies().subscribe(
      (result) => {
        this.listOfFamilies = result;
      },
      (err) => console.error(err)
    );
  }

  /**
   * Load the projects in the select
   */
  loadProjects() {
    this.projectService.getAllProjects().subscribe(
      (result) => {
        this.listOfProjects = result;
      },
      (err) => console.error(err)
    );
  }

  /**
   * The form was submited
   * @param the form filled
   */
  onSubmit({ value, valid }: { value: any; valid: boolean }): void {
    if (valid) {
      value.family = value.family._id;
      value.project = value.project._id;
      if (value.observations == "") delete value.observations;

      this.finishRegister(value);
    }
  }

  /**
   * Complete the registration process
   * @param value
   */
  finishRegister(value) {
    this.rackService.createRack(value).subscribe((result) => {
      let message = {
        title: "Embalagem Cadastrada",
        body: "A embalagem foi cadastrada com sucesso",
      };
      this.toastService.show("/rc/cadastros/embalagem", message);
    });
  }

  /**
   * Configure the form group
   */
  configureForm() {
    this.mRack = this.fb.group({
      tag: this.fb.group({
        code: [
          "",
          [
            Validators.required,
            Validators.minLength(4),
            Validators.pattern(/^((?!\s{2}).)*$/),
          ],
        ],
        version: [
          "",
          [Validators.required, Validators.pattern(/^((?!\s{2}).)*$/)],
        ],
        manufactorer: [
          "",
          [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern(/^((?!\s{2}).)*$/),
          ],
        ],
        deviceModel: [null, [Validators.required]],
      }),
      serial: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^((?!\s{2}).)*$/),
        ],
      ],
      type: ["", [Validators.required, Validators.pattern(/^((?!\s{2}).)*$/)]],
      weigth: [
        "",
        [Validators.required, Validators.pattern(/^(?![0.]+$)\d+(\.\d{1,})?$/)],
      ],
      width: [
        "",
        [Validators.required, Validators.pattern(/^(?![0.]+$)\d+(\.\d{1,})?$/)],
      ],
      heigth: [
        "",
        [Validators.required, Validators.pattern(/^(?![0.]+$)\d+(\.\d{1,})?$/)],
      ],
      length: [
        "",
        [Validators.required, Validators.pattern(/^(?![0.]+$)\d+(\.\d{1,})?$/)],
      ],
      capacity: [
        "",
        [Validators.required, Validators.pattern(/^(?![0.]+$)\d+(\.\d{1,})?$/)],
      ],
      family: [null, [Validators.required]],
      project: [null, [Validators.required]],
      observations: ["", [Validators.maxLength(140)]],
      active: false,
    });
  }

  validateTag(event: any) {
    //console.log(this.mRack.get('tag.code').value);

    if (!this.mRack.get("tag.code").errors) {
      this.validateNotTakenLoading = true;
      this.rackService
        .getAllRacks({ tag_code: this.mRack.get("tag.code").value })
        .subscribe((result) => {
          if (result.length == 0) this.mRack.get("tag.code").setErrors(null);
          else
            this.mRack.get("tag.code").setErrors({ uniqueValidation: true });

          this.validateNotTakenLoading = false;
        });
    }
  }

  /**
   * Validação assíncrona
   */
  public validateNotTakenLoading: boolean;
  // validateNotTaken(control: AbstractControl) {
  //   this.validateNotTakenLoading = true;
  //   return control
  //     .valueChanges
  //     .delay(800)
  //     .debounceTime(800)
  //     .distinctUntilChanged()
  //     .switchMap(value => this.rackService.getAllRacks({ tag_code: control.value }))
  //     .map(res => {
  //       this.validateNotTakenLoading = false;

  //       if (res.length == 0) {
  //         console.log('empty')
  //         return control.setErrors(null);
  //       } else {
  //         console.log('not empty')
  //         return control.setErrors({ uniqueValidation: 'code already exist' })
  //       }
  //     })
  // }
}
