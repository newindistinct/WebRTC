import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { mydemo } from 'src/app/webcam/webcam.page';

@Component({
  selector: 'app-front-camera',
  templateUrl: './front-camera.component.html',
  styleUrls: ['./front-camera.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,]
})
export class FrontCameraComponent implements OnInit {
  name: string;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit(){
    mydemo();
  }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(null, 'confirm');
  }
}
