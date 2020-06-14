import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController,AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UserPage } from '../user/user.page';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})

export class TabsPage implements OnInit {
  private user: User;
  constructor(private login: UserService, private router: Router,
    private modalCtrl: ModalController, private alertCtrl: AlertController) { }
  ngOnInit() {
    this.user = this.login.getUser();
    console.log('usuario:');
    console.log(this.login.getUser());
  }
  editUser() {
    console.log('[TabsPage] editUser()');
    this.modalCtrl.create({
      component: UserPage,
      componentProps: { mode: 'edit', user: this.user }
    }).then((modal) => {
      modal.onDidDismiss()
        .then((evt) => this.user = this.login.getUser());
      modal.present();
    });
    

  }
  doExit() {
    console.log('[TabsPage] doExit()');
    //this.router.navigateByUrl('/login');
    this.login.logout()
      .then(() => { this.router.navigateByUrl('/login'); })
      .catch((err) => {
        this.alertCtrl.create({
          header: 'Cannot log out',
          message: err.message,
          buttons: [{
            text: 'OK',
            role: 'cancel'
          }]
        }).then((alert) => alert.present());
      });
    

  }

}
