import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FaceDetector, FilesetResolver, Detection } from '@mediapipe/tasks-vision';

@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.page.html',
  styleUrls: ['./webcam.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class WebcamPage implements OnInit {
  @ViewChild('video1', { static: false })
  public video1: ElementRef<HTMLVideoElement>;
  @ViewChild('video2', { static: false })
  public video2: ElementRef<HTMLVideoElement>;

  @ViewChild('canvas1', { static: false })
  public canvas1: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas2', { static: false })
  public canvas2: ElementRef<HTMLCanvasElement>;
  @ViewChild('image', { static: false })
  public image: ElementRef<HTMLImageElement>;

  @ViewChild('liveLiew', { static: false })
  public liveView: ElementRef<HTMLDivElement>;

  constructor() { }


  res1: string;
  res2: string;
  testRes: string[] = ['nHD', 'VGA', 'SVGA', 'HD', 'UXGA', 'FHD', 'UHD'];
  selectedResolution1: string;
  selectedResolution2: string;


  images: {
    imageW: number,
    imageH: number,
    imageC: string,
    imageT: string
  }[] = [];

  deviceIDs: string[] = [];
  deviceNames: string[] = [];
  devices: { deviceID: string, deviceName: string }[] = [];
  selectedValue1: string;
  selectedValue2: string;

  captures: string[] = [];
  showResolutionWidth: number[] = [];
  showResolutionheight: number[] = [];
  text: string[] = [];

  width1: number;
  height1: number;
  width2: number;
  height2: number;
  i: number = 3;

  async ngOnInit() {
    // this.getmediaDevices();
    this.Resolution();
    this.checkCamera();
    this.setCamera();
    // this.initializefaceDetector();
  }
  Resolution() {
    if (this.selectedResolution1 == "1") {
      this.res1 = this.testRes[0];
    }
    if (this.selectedResolution1 == "2") {
      this.res1 = this.testRes[1];
    }
    if (this.selectedResolution1 == "3") {
      this.res1 = this.testRes[2];
    }
    if (this.selectedResolution1 == "4") {
      this.res1 = this.testRes[3];
    }
    if (this.selectedResolution1 == "5") {
      this.res1= this.testRes[5];
    }
    if (this.selectedResolution2 == "1") {
      this.res2 = this.testRes[0];
    }
    if (this.selectedResolution2 == "2") {
      this.res2 = this.testRes[1];
    }
    if (this.selectedResolution2 == "3") {
      this.res2 = this.testRes[2];
    }
    if (this.selectedResolution2 == "4") {
      this.res2 = this.testRes[3];
    }
    if (this.selectedResolution2 == "5") {
      this.res2 = this.testRes[5];
    }
    if (this.res1 == 'UHD') {
      this.width1 = 3840;
      this.height1 = 2160;
    }
    if (this.res1 == 'FHD') {//
      this.width1 = 1920;
      this.height1 = 1080;
    }
    if (this.res1 == 'UXGA') {
      this.width1 = 1600;
      this.height1 = 1200;
    }
    if (this.res1 == 'HD') {//
      this.width1 = 1280;
      this.height1 = 720;
    }
    if (this.res1 == 'SVGA') {//
      this.width1 = 800;
      this.height1 = 600;
    }
    if (this.res1 == 'VGA') {//
      this.width1 = 640;
      this.height1 = 480;
    }
    if (this.res1 == 'nHD') {//
      this.width1 = 480;
      this.height1 = 360;
    }
    if (this.res2 == 'UHD') {
      this.width2 = 3840;
      this.height2 = 2160;
    }
    if (this.res2 == 'FHD') {//
      this.width2 = 1920;
      this.height2 = 1080;
    }
    if (this.res2 == 'UXGA') {
      this.width2 = 1600;
      this.height2 = 1200;
    }
    if (this.res2 == 'HD') {//
      this.width2 = 1280;
      this.height2 = 720;
    }
    if (this.res2 == 'SVGA') {//
      this.width2 = 800;
      this.height2 = 600;
    }
    if (this.res2 == 'VGA') {//
      this.width2 = 640;
      this.height2 = 480;
    }
    if (this.res2 == 'nHD') {//
      this.width2 = 480;
      this.height2 = 360;
    }
    console.log(this.width1 + "x" + this.height1);
    console.log(this.width2+ "x" + this.height2);
  }
  onSelectedResolution1(value: string) {
    this.selectedResolution1 = value;
    this.Resolution();
    this.onSelect1(this.selectedValue1)
  }
  onSelectedResolution2(value: string) {
    this.selectedResolution2 = value;
    this.Resolution();
    this.onSelect2(this.selectedValue2)
  }
  async getConnectedDevices(type: any) {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === type)
  }
  async checkCamera() {
    const cameras = await this.getConnectedDevices('videoinput');
    if (cameras.length === 0) {
      console.log('No cameras found');
    } else {
      console.log('Available cameras:', cameras);
      cameras.forEach((camera) => {
        this.deviceIDs.push(camera.deviceId);
        this.deviceNames.push(camera.label);
        this.devices = this.deviceIDs.map((deviceID, index) => (
          {
            deviceID,
            deviceName: this.deviceNames[index]
          }));
        console.log('Available cameras:', this.devices);
      })
    }
  }
  async openCamera(cameraId: any, minWidth: any, minHeight: any) {
    const constraints = {
      'video': {
        'deviceId': cameraId,
        'width': { 'min': 480, 'ideal': minWidth, 'max': 3840 },
        'height': { 'min': 360, 'ideal': minHeight, 'max': 2160 }
      }
    }
    return await navigator.mediaDevices.getUserMedia(constraints);
  }
  async setCamera() {
    const cameras = await this.getConnectedDevices('videoinput');
    if (cameras && cameras.length > 0) {
      const stream = this.openCamera(cameras[0].deviceId, this.width1, this.height1);
      stream.then(stream => {
        console.log('Got MediaStream:', stream);
        this.video1.nativeElement.srcObject = stream;
        this.video2.nativeElement.srcObject = stream;
        this.video1.nativeElement.play();
        this.video2.nativeElement.play();
        console.log(this.video1);
        console.log(this.video2);
      })
        .catch(error => {
          console.error('Error accessing media devices.', error);
        });
    }
  }
  closeCamera1() {
    const videoElement = this.video1.nativeElement;
    const stream = videoElement.srcObject as MediaStream;

    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoElement.srcObject = null;
    }
  }
  closeCamera2() {
    const videoElement = this.video2.nativeElement;
    const stream = videoElement.srcObject as MediaStream;

    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoElement.srcObject = null;
    }
  }
  onSelect1(value: string) {
    if (value != "0") {
      this.closeCamera1();
      console.log(this.selectedValue1);
      const stream = this.openCamera(value, this.width1, this.height1);
      stream.then(stream => {
        console.log('Got MediaStream:', stream);
        this.video1.nativeElement.srcObject = stream;
        console.log('Got currentTime:', this.video1.nativeElement.currentTime);
        this.video1.nativeElement.play();
        console.log(this.video1);
      })
        .catch(error => {
          console.error('Error accessing media devices.', error);
        });
    } else {
      this.closeCamera1();
    }  
  }
  onSelect2(value: string) {
    if (value != "0") {
      this.closeCamera2();
      console.log(this.selectedValue2);
      const stream = this.openCamera(value, this.width2, this.height2);
      stream.then(stream => {
        console.log('Got MediaStream:', stream);
        this.video2.nativeElement.srcObject = stream;
        this.video2.nativeElement.play();
        console.log(this.video2);
      })
        .catch(error => {
          console.error('Error accessing media devices.', error);
        });
    } else {
      this.closeCamera2();
    }
  }

  public capture1() {
    const context = this.canvas1.nativeElement.getContext('2d');
    if (context) {
      const video1 = this.video1.nativeElement;
      this.canvas1.nativeElement.width = video1.videoWidth;
      this.canvas1.nativeElement.height = video1.videoHeight;
      context.drawImage(this.video1.nativeElement, 0, 0, video1.videoWidth, video1.videoHeight);
      const capturedImage = this.canvas1.nativeElement.toDataURL('image/jpeg');
      this.captures.push(capturedImage);
      this.showResolutionWidth.push(this.canvas1.nativeElement.width);
      this.showResolutionheight.push(this.canvas1.nativeElement.height);
      this.text.push('cam 1');
      this.images = this.showResolutionWidth.map((imageW, index) => ({
        imageW,
        imageH: this.showResolutionheight[index],
        imageC: this.captures[index],
        imageT: this.text[index]
      }));
    } else {
      console.error('Canvas context is null.');
    }
  }

  public capture2() {
    const context = this.canvas2.nativeElement.getContext('2d');
    if (context) {
      const video2 = this.video2.nativeElement;
      this.canvas2.nativeElement.width = video2.videoWidth;
      this.canvas2.nativeElement.height = video2.videoHeight;
      context.drawImage(this.video2.nativeElement, 0, 0, video2.videoWidth, video2.videoHeight);
      const capturedImage = this.canvas2.nativeElement.toDataURL('image/jpeg');
      this.captures.push(capturedImage);
      this.showResolutionWidth.push(this.canvas2.nativeElement.width);
      this.showResolutionheight.push(this.canvas2.nativeElement.height);
      this.text.push('cam 2');
      this.images = this.showResolutionWidth.map((imageW, index) => ({
        imageW,
        imageH: this.showResolutionheight[index],
        imageC: this.captures[index],
        imageT: this.text[index]
      }));
    } else {
      console.error('Canvas context is null.');
    }
  }
}

