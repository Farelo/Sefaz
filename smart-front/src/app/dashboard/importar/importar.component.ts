import { Component, OnInit  } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { FileUploader } from 'ng2-file-upload';
import * as Handsontable from 'handsontable/dist/handsontable.full.js';

@Component({
  selector: 'app-importar',
  templateUrl: './importar.component.html',
  styleUrls: ['./importar.component.css']
})
export class ImportarComponent implements OnInit {
  private data: any[];
  private colHeaders: string[];
  private columns: any[];
  private options: any;
  public file : any;
  public fileName: string;
  public uploader = [];
  public send = false;

  constructor(private http: Http){  }

  public ngOnInit(){
  }

  remove(){
    this.uploader.pop();
    this.send = false;
  }

  fileEvent(fileInput: any){
    const files = fileInput.target.files || fileInput.srcElement.files;
    const file = files[0];
    const formData = new FormData();
    formData.append('upfile', file);
    this.file = formData;
    if(this.uploader.length != 0)this.uploader.pop()
    this.uploader.push(file)
    this.send = false;
}
  sendFile(){
    this.http.post("http://localhost:8984/api/upload", this.file).subscribe(res => {
      this.send = true;
      this.data = res.json().data;
      this.colHeaders = ['Active', 'Amount', 'Country ID', 'Date', 'ID', 'Product ID'];
      this.columns = [
        {data: 'active', type: 'checkbox', checkedTemplate: 'true', uncheckedTemplate: 'false'},
        {data: 'amount', type: 'numeric', format: 'R$ 0,0.00[0000]'},
        {data: 'country id', type: 'text'},
        {data: 'date', type: 'date', dateFormat: 'DD/MM/YYYY'},
        {data: 'id', type: 'numeric'},
        {data: 'product id', type: 'text'}
      ];
      this.options = {
        height: 396,
        width: 700,
        rowHeaders: true,
        stretchH: 'all',
        columnSorting: true,
        contextMenu: true,
        //className: 'htCenter htMiddle',
        //readOnly: true
      };
    });

}


}
