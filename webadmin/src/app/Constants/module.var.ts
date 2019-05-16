import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModuleVar {
   
    active       = 'Active';
    title        = '';
    divisionName   = 'Mt.Operation';
    createModule = 'Create Program';
    activeStatus =  [];
    moduleList=[];
    fileId;
    hideAllVideos;
    hideCourseVideos;
    url;
    moduleId;
    courseId;
    videoLink;
    selectedModule;
    selectedVideo=[];
    selectedCourse;
    courseVideos=[];
    selectedCourses = null;
    selectedTrainingClass = null;
    selectedEmployee = [];
    labels = {};
    courseList = [];
    resortList = [];
    departmentList = [];
    trainingClassList = [];
    divisionList = [];
    employeeList = [];
    selectedDepartment=[];
    selectedResort = [];
    selectedDivision = [];

    courseListPage = [];
    courseItems = [];
    dropdownSettings;
    quizDetails = [];
    selectedCourseIds = [];
    // courseId;
    videoId;
    videoFile;
    moduleObj;
    moduleName;
    sortableList;
    videoList = [];
    tabEnable = false;
    selectCourseName;
    selectVideoName;
    programName;
    description;
    courseIndex;
    tabKey;
    hidemodule;
    api_url;
    uploadFile ;
    videoIndex = 0;
    fileUrl;
    moduleNameCheck = false;
    modalRef;
    modalConfig;
    fileExtension;

    departmentSettings = {
        singleSelection: false,
        idField: 'departmentId',
        textField: 'departmentName',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableCheckAll: false,
        itemsShowLimit: 8,
    }
    resortSettings = {
        singleSelection: false,
        idField: 'resortId',
        textField: 'resortName',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableCheckAll: false,
        itemsShowLimit: 8,
    }
    empSettings = {
        singleSelection: false,
        idField: 'userId',
        textField: 'userName',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableCheckAll: false,
        itemsShowLimit: 8,
    }
    divisionSettings = {
        singleSelection: false,
        idField: 'divisionId',
        textField: 'divisionName',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableCheckAll: false,
        itemsShowLimit: 8,
    }
    courseSettings = {
        singleSelection: false,
        idField: 'courseId',
        textField: 'courseName',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableCheckAll: false,
        itemsShowLimit: 8,
    }
}