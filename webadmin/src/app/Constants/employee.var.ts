import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EmployeeVar {
    employeeStatus = {
        "title" : "Employee Status",
        "exportTo" : "Export to",
        "noData" : "No Data!",
        "btns" : {
            "select" : "Select",
            "excel" : "Excel",
            "pdf" : "PDF"
        },
        "tableTitle" : {
            "employeeName" : "Employee Name",
            "employeeGroup" : "Employee Group",
            "assignedCount" : "Assigned",
            "inProgressCount" : "In progress",
            "completedCount" : "Completed",
            "failedCount" : "Failed",
            "ratings" : "Ratings",
            "total" : "Total"
        }
    };
    employeeDetails = {
        "title" : "Employee Details",
        "exportTo" : "Export to",
        "noData" : "No Data!",
        "employeeName" : "Employee Name",
        "btns" : {
            "select" : "Select",
            "excel" : "Excel",
            "pdf" : "PDF"
        },
        "tableTitle" : {
            "courseName" : "Course Name",
            "percentageCompleted" : "% Completed",
            "badgeName" : "Badge Name",
            "videos" : "Videos",
            "status" : "Status",
            "assignedDate" : "Assigned Date",
            "viewedDate" : "Viewed Date",
            "completedDate" : "Completed Date"
        }
    };
}
