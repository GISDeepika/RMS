import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute,Params } from '@angular/router';
import { HttpService,HeaderService,UtilService,AlertService,ExcelService, CourseService } from '../../../services';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css']
})
export class EmployeesListComponent implements OnInit {
  courseId;
  resortId;
  listDetails = [];
  count = 0;
  pageLimitOptions;
  pageLimit;

  constructor(private route: Router,private activatedRoute: ActivatedRoute,private utilService :UtilService,private courseService : CourseService,private headerService : HeaderService,private excelService : ExcelService) { 
    this.activatedRoute.params.subscribe((params: Params) => {
      this.courseId = params['courseId']; 
      console.log(this.courseId)
    });
  }

  ngOnInit() {
    let user = this.utilService.getUserData();
    this.resortId = user.Resorts && user.Resorts[0].resortId;
    this.headerService.setTitle({ title: 'CMS Library', hidemodule: false });
    this.pageLimitOptions = [5, 10, 25];
    this.pageLimit = [this.pageLimitOptions[1]];
    this.getEmployeeList();
  }

  //Get Employee List
  getEmployeeList(){
    this.courseService.getEmployeeListDetails(this.resortId,this.courseId).subscribe(resp=>{
      console.log(resp)
      if(resp && resp.isSuccess){
        this.listDetails = resp.data && resp.data.rows.length && resp.data.rows;
        this.count = resp.data && resp.data.rows.length && resp.data.count;
      }
    })
  }

  // Create Excel sheet
  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.listDetails, this.listDetails[0].Course.courseName);
  }
}
