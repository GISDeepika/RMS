import { Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {ForumVar} from '../../Constants/forum.var';
import { ToastrService } from 'ngx-toastr';
import { API_URL } from '../../Constants/api_url';

@Component({
    selector: 'app-createForum',
    templateUrl: './createForum.component.html',
     styleUrls: ['./createForum.component.css']
})

export class CreateForumComponent implements OnInit {
   
    employeeItems;
    forumName;
    autocompleteItemsAsEmpObjects;
    topicsArray = [{
      topicName:''
    }];
    topics;
   
   constructor(private toastr:ToastrService,private forumVar:ForumVar,private http: HttpService){
    this.forumVar.url = API_URL.URLS;
   }

   ngOnInit(){
    this.getEmployeeList();
    this.getForumList();
    
   }

   getForumList(){
      this.http.get(this.forumVar.url.getForumList).subscribe((data) => {
      this.forumVar.forumList= data.forumDetails;
      this.forumVar.forumNameList=this.forumVar.forumList.map(item=>{
        return item.forumName;
      });
     });   
   }

   getEmployeeList(){
     this.http.get(this.forumVar.url.getEmployeeList).subscribe((resp) => {
        this.employeeItems=resp.employeeList;
        this.autocompleteItemsAsEmpObjects = resp.employeeList.map(item=>{
          return item.name;
        });
      });
    }
    
    addTopic(){
      let obj={
        topicName:''
      };
      this.topicsArray.push(obj);
    }

    removeTopic(i){
      this.topicsArray.splice(i, 1);   
    }

    checkNameUniqueness(forumName){
      for (let i = 0; i <  this.forumVar.forumNameList.length; i++) {    
        if(this.forumVar.forumNameList[i].toUpperCase()===forumName.toUpperCase()){
          this.forumVar.uniqueValidate=true;
          break;
        }else{
          this.forumVar.uniqueValidate=false;
        }
      }
    }

    onSubmitForm(form){
      if(this.topicsArray){
        this.topics = this.topicsArray.map(item=>{
           return item.topicName;
        });
      }

      if(form.valid && !this.forumVar.uniqueValidate ){
        let postData={
          forumName : form.value.forumName,
          employeeList : form.value.empItems,
          topic   : this.topics
        }; 
          this.toastr.success(this.forumVar.addSuccessMsg);
          this.clearForm();
          this.forumVar.uniqueValidate=false;
      }
    }

    clearForm(){
       this.forumName="";
       this.topicsArray = [{
        topicName:''
      }];
    }

}
