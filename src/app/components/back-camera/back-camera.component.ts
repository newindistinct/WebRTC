import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-back-camera',
  templateUrl: './back-camera.component.html',
  styleUrls: ['./back-camera.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class BackCameraComponent implements OnInit {
  isModalOpen = false;
  constructor() { }

  ngOnInit() { }


  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
}
