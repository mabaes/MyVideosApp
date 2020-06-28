import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from '../services/user.service'
import { ModalController, AlertController } from '@ionic/angular';
import { UserPage } from '../user/user.page';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user: string;
  password: string;

  constructor(private login: UserService, private router: Router,
    private alertCtrl: AlertController, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute =()=> {
      return false;
    }
  }
  doLogin() {
    console.log('[LoginPage] doLogin()');
    //this.router.navigateByUrl('/tabs');
    
    this.login.login(this.user, this.password)    
      //{skipLocationChange: true }
      .then(() => { 
        this.user ='';
        this.password='';
        this.router.navigateByUrl('/tabs'); })
      .catch((err) => {
        this.alertCtrl.create({
          header: 'Authentication error',
          message: err.message,
          buttons: [{
            text: 'OK',
            role: 'cancel'
          }]
        }).then((alert) => alert.present());
      });
      
  }

  signup() {
    console.log('[LoginPage] signup()');
    
   
    this.modalCtrl.create({
      component: UserPage,
      componentProps: {
        mode: 'add'
      }
    }).then((modal) => { modal.present() });
    
    
  }

}




