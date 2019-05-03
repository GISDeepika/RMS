import { Component,TemplateRef, OnInit ,ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from "lodash";
import { TabsetComponent } from 'ngx-bootstrap';
import { HeaderService } from '../services/header.service';
import { HttpService } from '../services/http.service';
import { UserVar } from '../Constants/user.var';
import { API_URL } from '../Constants/api_url';
import { AlertService } from '../services/alert.service';
import {CommonService} from '../services/restservices/common.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import * as XLSX from 'ts-xlsx';
import {UserService,ResortService, UtilService} from '../services';

@Component({
    selector: 'app-users',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {
    @ViewChild('staticTabs') staticTabs: TabsetComponent;
    userName;
    userId;
    userType;
    department = "";
    designation = "";
    division = "";
    reportingTo = "";
    emailAddress;
    phoneNumber;
    userIndex;
    pageLimitOptions = [];
    pageLimit;
    labels;
    message;
    accessTo="web";
    editEnable= false;
    validPhone = false;
    validEmail = false;
    validUserId = false;
    triggerNext = false;
    departmentArray = [];
    designationArray = [];
    divisionArray=[];
    designationData = [];
    fileUploadValue;
    userid;
    arrayBuffer: any;
    divisionDetails;
    divisionError;
    divisionValidationCheck = true;
    editDivisionValue;
    editDepartmentList;
    divisionId;
    errMsg;
    roles;
    roleDetails;
    roleId;
    editRoleValue;
    removeDepartmentIds=[];

    constructor(private alertService: AlertService,private commonService:CommonService ,private utilService: UtilService, private userService:UserService,private resortService: ResortService,private http: HttpService,private modalService : BsModalService,  public constant: UserVar, private headerService:HeaderService, private toastr: ToastrService, private router: Router) {
        this.constant.url = API_URL.URLS;
        this.labels = constant.labels;
    }
    ngOnInit() {
        this.headerService.setTitle({ title: 'User Management', hidemodule: false });
        this.pageLimitOptions = [5, 10, 25];
        this.pageLimit = [this.pageLimitOptions[1]];
        this.userList();
        this.getResortId();

    }

    getResortId(){
        let userData = this.utilService.getUserData();
        let resortId = userData.Resorts ? userData.Resorts[0].resortId : '';
        
        //get Resort list
        this.resortService.getResortByParentId(resortId).subscribe((result)=>{
            this.divisionArray=result.data.divisions;

        })

        this.commonService.getDesignationList(resortId).subscribe((result)=>{
            this.designationArray=result.data.rows;
        })
        this.getDivisionList(resortId);
    }

    getDivisionList(resortId){
        this.commonService.getResortDivision(resortId).subscribe(resp=>{
            if(resp && resp.isSuccess){
                this.divisionDetails = resp.data.length && resp.data[0].resortMapping && resp.data[0].resortMapping;
            }  
        })

        this.userService.getResortDesignation(resortId).subscribe(resp=>{
            console.log(resp);
            if(resp && resp.isSuccess){
                this.roleDetails = resp.data.rows.length && resp.data.rows;
            }
        })
        this.roles = [{
            designationName : ''
        }]
    }

    userList(){
     const userId = this.utilService.getUserData().userId;
      this.userService.getUser(userId).subscribe((resp)=>{
          if(resp.isSuccess){
              this.constant.userList = resp.data.rows;
          }
        });
        let data = this.utilService.getUserData();
        if(data && data.UserRole && data.UserRole[0] &&  data.UserRole[0].roleId){
            this.userType  = data.UserRole[0].roleId;
        }
    }

    changedivision(){
         this.department = "";
         this.departmentArray= [];
            const obj={'divisionId': this.division};
            this.commonService.getDepartmentList(obj).subscribe((result)=>{
            if(result.isSuccess){
                this.departmentArray = result.data.rows;
                }
            })
        
     }

    //update user
    userEdit(data, index) {  
        this.changedivision();  
            this.userid = data.UserRole[0].userId;   
            this.editEnable= true;
            this.userIndex = index;
            this.userName = data.userName;
            this.userId = data.employeeId;
            this.department = data.Department ? data.Department.departmentId : "";
            this.division =data.Division ? data.Division.divisionId : "";
            this.designation= data.Designation?data.Designation.designationId : "";
            this.reportingTo=data.reportDetails?data.reportDetails.designationId : "";
            this.emailAddress = data.email;
            this.phoneNumber = data.phoneNumber;    
            //this.accessTo = data.accessTo;  
    }

    designationUpdate(data, designation) {
        if (data == "") {
            this.designationData = [];
        }
        this.designation = '';
        this.department = data !== "null" ? data : '';
        this.designationArray.forEach(item => {
            if (parseInt(data) === item.id) {
                this.designationData = item.designations;
            }
        })
        if (designation) {
            this.designation = designation;
        }
    }


    closeAddForm() {
        this.resetFields();
        this.constant.modalRef.hide();
    }

    activeStatus(data){
        let userId = data.UserRole[0].userId;
        let params ={
             active : !data.active 
          }
         this.userService.activeUser(userId,params).subscribe(res=>{
            if(res.isSuccess){
                this.alertService.success(res.result);
                this.userList();
            }
         });
    }
    openAddUser(template: TemplateRef<any>, data,  index) {
        if(data){
         this.userEdit(data,index);
         this.constant.modalRef = this.modalService.show(template, this.constant.modalConfig);
        }else{
         this.resetFields();   
         this.constant.modalRef = this.modalService.show(template, this.constant.modalConfig);
        }
        this.getResortId();
    }

    openAddRole(template: TemplateRef<any>, data,  index){
        
        // if(data){
            this.constant.modalRef = this.modalService.show(template, this.constant.modalConfig);
        //    }else{
            // this.resetFields();   
            // this.constant.modalRef = this.modalService.show(template, this.constant.modalConfig);
        //    }
    }


    submitRole(){
        console.log(this.roleId)
        let userData = this.utilService.getUserData();
        let resortId = userData && userData.Resorts && userData.Resorts[0].resortId;
        if(this.roleId){
            let params = {
                designationName : this.editRoleValue
            }
            this.userService.updateDesignation(this.roleId,params).subscribe(resp=>{
                if(resp && resp.isSuccess){
                    this.getDivisionList(resortId);
                    this.constant.modalRef.hide();
                    this.resetFields();
                    this.alertService.success("Designation updated successfully")
                }
            })

        }else{
            let params = {
                resortId : resortId,
                designation : this.roles
            }
            this.userService.addResortDesignation(params).subscribe(resp=>{
                if(resp && resp.isSuccess){
                    this.getDivisionList(resortId);
                    this.constant.modalRef.hide();
                    this.resetFields();
                    this.alertService.success("Designation added successfully")
                }
            })
        }      
    }
   
    //delete user
    removeUser(template: TemplateRef<any>,data, i) {
        let modalConfig={
            class : "modal-dialog-centered"

        }
     this.userid= data.UserRole[0].userId;
     this.constant.modalRef = this.modalService.show(template,modalConfig); 
    }

   deleteuser(){
     this.userService.deleteUser(this.userid).subscribe((result)=>{
         if(result.isSuccess){
             this.constant.modalRef.hide();
             this.userList();
             this.alertService.success(result.message);
         }
     })
   }

    //add new user
    addUser(data) {
         this.errMsg='';
          let obj = {
                userName : this.userName,
                password: "123456",
                email : this.emailAddress,
                phoneNumber : this.phoneNumber,
                designationId:this.designation,
                divisionId:this.division,
                departmentId:this.department,
                reportingTo:this.reportingTo,
                accessTo: this.accessTo,
                };

        if(this.userName && this.emailAddress && this.phoneNumber && this.division && this.department && this.designation && !this.validEmail && !this.validPhone){         
            if(this.editEnable){
                this.userService.updateUser(this.userid,obj).subscribe((result)=>{
                    if(result.isSuccess){
                        this.closeAddForm();
                        this.userList(); 
                        this.alertService.success(this.labels.userUpdated);
                    }
                },err =>{
                this.errMsg=err.error.error;
            })
            }else{
                obj['createdBy'] = this.utilService.getUserData().userId;
                this.userService.addUser(obj).subscribe(result => {
                    if(result.isSuccess){
                    this.closeAddForm();
                    this.userList();
                    this.alertService.success(this.labels.userAdded);
                    }
                },err =>{
                this.errMsg=err.error.error;
            });
            }}
      }


    //reset
    resetFields() {
        this.editEnable= false;
        this.accessTo="web";
        this.userName = '';
        this.userId = '';
        this.roleId = '';
        this.department = '';
        this.designation = '';
        this.division = '';
        this.reportingTo = '';
        this.emailAddress = '';
        this.phoneNumber = '';
        this.triggerNext = false;
        this.editRoleValue = '';
        this.roles = [{
            designationName : ''
        }]
        this.constant.divisionTemplate = [{
            divisionName : '',
            departments : [
                {
                   departmentName : ''
                }
            ]
        }];
    }

    validationUpdate(type) {
        if (type === "email") {
            this.validEmail = this.emailAddress && this.validationCheck("email", this.emailAddress) === 'invalidEmail' ? true : false;
        }
        else if (type === "mobile") {
            this.validPhone = this.phoneNumber && this.validationCheck("mobile", this.phoneNumber) ? false : true;
        }
        else {
            this.validEmail = this.emailAddress && this.validationCheck("email", this.emailAddress) === 'invalidEmail' ? true : false;
            this.validPhone = this.phoneNumber && this.validationCheck("mobile", this.phoneNumber) ? false : true;
        }
    }
    
    // email and mobile number validation check
    validationCheck(type, value) {
        if (type === "email") {
            var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!emailRegex.test(value)) {
                return "invalidEmail"
            }
        }
        if (type === "mobile") {
            let data = value.toString();
            let phoneNum = data.replace("+", "");
            let phoneNumValid = phoneNum ? (phoneNum.length === 12 ? true : false) : false;
            return phoneNumValid
        }
    }

    messageClose() {
        this.message = '';
    }

    submitDivision(){
        let userData = this.utilService.getUserData();
        let resortId = userData && userData.Resorts && userData.Resorts[0].resortId;
        this.divisionValidationCheck = true;
        this.constant.divisionTemplate.forEach(item=>{
            item.departments.forEach(value=>{
                if(value.departmentName === ''){
                    this.divisionValidationCheck = false;
                }
            })
        })
        if(this.divisionValidationCheck) {
            let params = {
                "resortId" : resortId,
                "division" : this.constant.divisionTemplate
            }
            this.userService.addDivision(params).subscribe(resp=>{
                if(resp && resp.isSuccess){
                    this.triggerNext = false ;
                    this.getDivisionList(resortId);
                    this.closeAddForm();
                }    
            })
        }else{
            this.divisionError = 'Department name is mandatory';
        }
    }

    next(){
        this.divisionValidationCheck = true;
        this.constant.divisionTemplate.forEach(item=>{
            if(item.divisionName === ''){
                this.divisionValidationCheck = false;
            }
        })
        this.divisionValidationCheck ?  this.triggerNext = true : this.divisionError = 'Division name is mandatory';
    }

    tabchange(event){
        if(event.target.name === "department"){
            this.next();
        }
        else{
            this.triggerNext = false;
        }
    }

    editDivisionData(data,template : TemplateRef<any>){
        this.editDepartmentList = [];
        this.editDivisionValue = data;
        let dataValue = data && data.Departments;
        this.editDepartmentList = dataValue;
        this.constant.modalRef = this.modalService.show(template, this.constant.modalConfig)
    }

    fileUpload(event) {
        let fileUploadValue = event.target.files[0];
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.arrayBuffer = fileReader.result;
            var data = new Uint8Array(this.arrayBuffer);
            var arr = new Array();
            for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");
            var workbook = XLSX.read(bstr, { type: "binary" });
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            let finalData = XLSX.utils.sheet_to_json(worksheet, { raw: true })
            finalData && finalData.forEach(item => {
                this.constant.userList.push(item)
            })
        }
        fileReader.readAsArrayBuffer(fileUploadValue);
    }

    addForm(type,i) {
        if(type === "division"){
            let obj = {
                divisionName : '',
                departments : [
                    {
                       departmentName : ''
                    }
                ]
            };
            this.constant.divisionTemplate.push(obj);
        }
        else if(type === "department"){
            let obj = {
                departmentName : ''
            };
            this.constant.divisionTemplate[i].departments.push(obj);
        }
        else if (type === 'roles'){
            let obj = {
                designationName : ''
            };
            this.roles.push(obj);
        }
    }
    
    removeForm(i,type,oi) {
        if(type === "division"){
            this.constant.divisionTemplate.splice(i, 1);
        }
        else if(type === 'department'){
            this.constant.divisionTemplate[i].departments.splice(oi, 1);
        }
        else if(type === 'roles'){
            this.roles.splice(oi,1);
        }
    }

    editDivisionForm(type,i){
        if(type === 'add'){
            let obj = {
                departmentName : ''
            };
            this.editDepartmentList.push(obj);
        }
        else if(type === 'edit'){
            this.editDepartmentList.splice(i, 1);
            this.removeDepartmentIds.push(this.editDepartmentList[i].departmentId);
            
        }
    }

     //delete division
     removeDivision(template: TemplateRef<any>,data, i) {
        let modalConfig={
            class : "modal-dialog-centered"

        }
        this.divisionId= data.Division.divisionId;
        this.constant.modalRef = this.modalService.show(template,modalConfig); 
       }

    deleteDivisionContent(){
        this.userService.deleteDivision(this.divisionId).subscribe(resp=>{
            if(resp && resp.isSuccess){
                let userData = this.utilService.getUserData();
                let resortId = userData.Resorts ? userData.Resorts[0].resortId : '';
                this.constant.modalRef.hide();
                this.getDivisionList(resortId);
                this.alertService.success('Division deleted successfully');
            }
        })
    }

     //delete role
     removeRole(template: TemplateRef<any>,data, i) {
        let modalConfig={
            class : "modal-dialog-centered"

        }
        this.roleId= data.designationId;
        this.constant.modalRef = this.modalService.show(template,modalConfig); 
       }

    deleteRoleContent(){
        this.userService.deleteDesignation(this.roleId).subscribe(resp=>{
            if(resp && resp.isSuccess){
                let userData = this.utilService.getUserData();
                let resortId = userData.Resorts ? userData.Resorts[0].resortId : '';
                this.constant.modalRef.hide();
                this.getDivisionList(resortId);
                this.alertService.success('Designation deleted successfully');
            }
        })
    }

    editRoleData(data,template : TemplateRef<any>){
        let modalConfig={
            class : "modal-dialog-centered"

        }
        this.roleId =  data && data.designationId;
        this.editRoleValue = data && data.designationName;
        this.constant.modalRef = this.modalService.show(template,modalConfig)
    }

    updateDivision(){
        if(Object.keys(this.editDivisionValue).length){
            let params = this.editDivisionValue.Departments.map(item=>{
                if(!item.departmentId){
                    item.divisionId  =  this.editDivisionValue.divisionId
                }
                return item;
            })
            this.editDivisionValue.Departments = params;
            this.editDivisionValue.removeDepartmentIds = this.removeDepartmentIds;
            this.userService.divisionUpdate(this.editDivisionValue,this.editDivisionValue.divisionId).subscribe(resp=>{
                if(resp && resp.isSuccess){
                    let userData = this.utilService.getUserData();
                    let resortId = userData.Resorts ? userData.Resorts[0].resortId : '';
                    this.constant.modalRef.hide();
                    this.getDivisionList(resortId);
                    this.alertService.success('Division updated successfully');
                }
            })
        }
    }

    cancelUpdate(){
        let userData = this.utilService.getUserData();
        let resortId = userData.Resorts ? userData.Resorts[0].resortId : '';
        this.constant.modalRef.hide();
        this.getDivisionList(resortId);
    }
}
