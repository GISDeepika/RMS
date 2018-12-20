import { Component,TemplateRef, OnInit} from '@angular/core';
import { Router} from '@angular/router';
import { HeaderService} from '../services/header.service';
import { ToastrService } from 'ngx-toastr';
import { HttpService} from '../services/http.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CertificateVar } from '../Constants/certificate.var';
import { API_URL } from '../Constants/api_url';

@Component({
    selector: 'app-certificates',
    templateUrl: './certificates.component.html',
    styleUrls: ['./certificates.component.css'],
})

export class CertificatesComponent implements OnInit {

   modalRef:BsModalRef;
   constructor(private http: HttpService,private constant:CertificateVar,private modalService:BsModalService,private headerService:HeaderService,private toastr:ToastrService,private router:Router){
       this.constant.url = API_URL.URLS;
   }
   ngOnInit(){
    this.headerService.setTitle({ title:this.constant.title, hidemodule: false});
    
    //get Template list
    this.http.get(this.constant.url.getTemplateList).subscribe((data) => {
        this.constant.certificateList = data.templateList;
    });
 
    //get Batch list
    this.http.get(this.constant.url.getBatchList).subscribe((data) => {
        this.constant.batchList = data.batchList;
    });
   }

   customOptions: any = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    responsive: {
      0: {
        items: 1
      },
      307: {
        items: 2
      },
      614: {
        items: 3
      },
      921: {
        items: 4
      }
    },
    nav: true,
    navText: ['<', '>']
  }

  
  openAddtemplate(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  //Template File Upload
  handleFileInput(files: FileList) {
    this.constant.fileToUpload = files.item(0);;
  }

  //dynamic add form
  addForm(){
    let obj={
        batch: 1,
        template: 1
    };
   this.constant.templateAssign.push(obj);
  }

  //Assign template to batch
  assignBatchTemplate(form){
    let batchId = this.constant.templateAssign.map(function(item){ return item.batch });
    batchId.sort();
    let last = batchId[0]; 
    if(batchId.length > 1){
        for (let i=1; i<batchId.length; i++) {
        if (batchId[i] == last){
        this.toastr.error(this.constant.assignErrMsg);
        }else{
            let postData = this.constant.templateAssign;
            this.toastr.success(this.constant.assignSuccessMsg);
            this.clearAssignTemplate();
        }
        last = batchId[i];
        }
   }else{
        let postData = this.constant.templateAssign;
        this.toastr.success(this.constant.assignSuccessMsg);
   }
  }
  
  //Reset Form
  clearAssignTemplate(){
   this.constant.templateAssign=[{
        batch: 1,
        template: 2
      }]
  }

  removeForm(i){
    this.constant.templateAssign.splice(i, 1);   
  }
 
  //Add Certificate Template
  onSave(form){
  if(form.valid){    
   if(this.constant.fileToUpload){
       let postData={
           templateName : form.templateName,
           htmlFile : this.constant.fileToUpload
     }
      this.toastr.success(this.constant.uploadSuccessMsg);
      this.modalRef.hide();
   }else{
       this.toastr.error(this.constant.uploadErrMsg);
   }
  }


  }

 




  
}
