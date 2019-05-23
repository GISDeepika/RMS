import { Component, OnInit,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Content } from 'ionic-angular';
import { Constant } from '../../constants/Constant.var';
import { HttpProvider } from '../../providers/http/http';
import { API_URL } from '../../constants/API_URLS.var';
//import { ForumDetailPage } from '../forum-detail/forum-detail';
import { Storage } from '@ionic/storage';
import { LoaderService, SocketService} from '../../service';
import * as moment from 'moment';

@IonicPage({
  name: 'forum-page'
})
@Component({
  selector: 'page-forum',
  templateUrl: 'forum.html',
  providers: [Constant, SocketService]
})
export class ForumPage implements OnInit {
  forumData: any = [];
  paramsData: any = { 'setData': [] };
  search='';
  showSearchBar: boolean = false;
  notificationCount;
  currentUser;

  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController,public storage: Storage,public socketService: SocketService,public navParams: NavParams, public constant: Constant, public http: HttpProvider, public API_URL: API_URL, private loader: LoaderService) {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ForumPage');
  }
  ionViewDidEnter() {
    this.getForumDatas();
  }
  ngOnInit(){

  }

  goToTopic(detailObj){
     this.paramsData['setData'] = detailObj;
    this.navCtrl.setRoot('topic-page',this.paramsData);
  }


  goToNotification() {
    this.navCtrl.setRoot('notification-page');
  }

   ngAfterViewInit() {
            let self = this;
            this.storage.get('currentUser').then((user: any) => {
            if (user) {
             self.currentUser = user;
              this.getNotification();
            }
        });
  }
 

  getForumDatas() {
    this.http.get(API_URL.URLS.getForum +'?search='+this.search).subscribe((res) => {
      if (res['isSuccess']) {
        this.forumData = res['data']['rows'];
      }
    });
  }


  calculateExpireDays(dueDate) {
    const a = moment(new Date());
    const b = moment(new Date(dueDate));
    return b.to(a, true);
  }
  
  toggleSearchBox() {
    this.showSearchBar = !this.showSearchBar;
    this.getForumDatas();
  }

  onInput($e) {
  
    if (this.search) {
      this.getForumDatas();
    } else {
      this.showSearchBar = false;
      this.search='';
      this.getForumDatas();
    }
  }
  onCancel($e) {
    this.showSearchBar = false;
    this.search='';
    this.getForumDatas();
  }

   getNotification(){
    let userId = this.currentUser.userId;
    let socketObj = {
      userId : userId
    };
   this.socketService.getNotification(socketObj).subscribe((data)=>{
       this.notificationCount = data['unReadCount'];
   });
  }

}
