import { Component, OnInit, Input } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  @Input()
  private user: User = { name: '', surname: '', email: '' };
  @Input()
  private mode: string;

 
  constructor(private camera: Camera, private login: UserService,
    private modalCtrl: ModalController) { }
  ngOnInit() { }
  close() {
    console.log('[UserPage] close()');
    this.modalCtrl.dismiss();
  }
  save() {
    console.log('[UserPage] save()');
    
    if (this.mode === 'edit') { this.login.updateUser(this.user); }
    else { this.login.addUser(this.user); }
    this.modalCtrl.dismiss();
    
  } 

}







