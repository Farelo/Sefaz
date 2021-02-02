import { Component, OnInit, Input } from "@angular/core";
import { NgbModal, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalDeleteComponent } from "../../shared/modal-delete/modal-delete.component";
import { Pagination } from "../../shared/models/pagination";
import { ProfileService } from "../../servicos/index.service";
import { constants } from "../../../environments/constants";
import { CreateUserComponent } from "./create-user/create-user.component";
import { EditUserComponent } from "./edit-user/edit-user.component";
declare var $: any;

@Component({
  selector: "app-modal-user",
  templateUrl: "./modal-user.component.html",
  styleUrls: ["./modal-user.component.css"],
})
export class ModalUserComponent implements OnInit {
  @Input() view;
  public userData: any[] = [];
  public actualPage = -1;

  constructor(
    public activeModal: NgbActiveModal,
    private profileService: ProfileService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.profileService.getUsers().subscribe((result) => {
      this.userData = result;
    });
  }

  createUser() {
    const modalRef = this.modalService.open(CreateUserComponent, {
      backdrop: "static",
    });
    this.activeModal.close();
  }

  editUser(user: any) {
    const modalRef = this.modalService.open(EditUserComponent, {
      backdrop: "static",
    });
    modalRef.componentInstance.mUser = user;
    modalRef.componentInstance.mType = "USER";
    this.activeModal.close();
  }

  removeProfile(profile): void {
    const modalRef = this.modalService.open(ModalDeleteComponent);
    modalRef.componentInstance.mObject = profile;
    modalRef.componentInstance.mType = "USER";

    modalRef.result.then((result) => {
      this.getUsers();
    });
  }

  getTypeLabel(type: string): string {
    let result = "";

    switch (type) {
      case "user":
        result = "Usuário";
        break;
      case "admin":
        result = "Administrador";
        break;
      case "masterAdmin":
        result = "Super Administrador";
        break;
    }
    return result;
  }

  isAdmin() {
    if (JSON.parse(localStorage.getItem("currentUser"))) {
      if (
        JSON.parse(localStorage.getItem("currentUser")).role == constants.ADMIN
      ) {
        return true;
      }
    }
    return false;
  }
}
