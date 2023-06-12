import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { FaceDetector, FilesetResolver, Detection } from '@mediapipe/tasks-vision';
import { FrontCameraComponent } from '../components/front-camera/front-camera.component';
import { BackCameraComponent } from '../components/back-camera/back-camera.component';

export function mydemo() {
  console.log("this is exportable function in TypeScript. !!");
  return console.log("this is exportable function in TypeScript. !!");
}




export interface ResolutionCanUse {
  width: number,
  height: number
}
type CamInfo = {
  name: string;
  label: string;
  deviceid: string;
};
@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.page.html',
  styleUrls: ['./webcam.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, FrontCameraComponent]
})
export class WebcamPage implements OnInit{
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

  public res1: string;
  public res2: string;
  public testRes: string[] = ['nHD', 'VGA', 'SVGA', 'HD', 'UXGA', 'FHD', 'UHD'];
  public selectedResolution1: string;
  public selectedResolution2: string;

  public images: {
    imageW: number,
    imageH: number,
    imageC: string,
    imageT: string
  }[] = [];

  public deviceIDsF: string;
  public deviceNamesF: string;
  public deviceIDsB: string;
  public deviceNamesB: string;
  public devices: { deviceID: string, deviceName: string }[] = [
    // {
    //   deviceID: "uygodiughpiduhfgpiuhfdpguh",
    //   deviceName: "camera2 1, facing front"
    // },
    // {
    //   deviceID: "uygodiughpiduhfgpiuhfdpguh",
    //   deviceName: "camera2 3, facing front"
    // },
    // {
    //   deviceID: "uygodiughpiduhfgpiuhfdpguh",
    //   deviceName: "camera2 5, facing back"
    // },
    // {
    //   deviceID: "uygodiughpiduhfgpiuhfdpguh",
    //   deviceName: "camera2 4, facing back"
    // },
    // {
    //   deviceID: "uygodiughpiduhfgpiuhfdpguh",
    //   deviceName: "camera2 2, facing back"
    // },
    // {
    //   deviceID: "uygodiughpiduhfgpiuhfdpguh",
    //   deviceName: "camera2 0, facing back"
    // }
  ]; public deviceIDs: string[] = [];
  public deviceNames: string[] = [];
  public selectedValue1: string;
  public selectedValue2: string;
  public compareWith1: any;
  public compareWith2: any;
  public compareWith3: any;
  public compareWith4: any;
  public captures: string[] = [];
  public showResolutionWidth: number[] = [];
  public showResolutionheight: number[] = [];
  public text: string[] = [];

  public width1: number;
  public height1: number;
  public width2: number;
  public height2: number;

  public cameraindexfront: number;
  public indexCameraF: number = 10;
  public indexCameraB: number = 10;
  public myFrontCamera: any[] = [];
  public myBackCamera: any[] = [];
  public searchfront: string = "front";
  public searchback: string = "back";
  // dname: string[] = ["camera2 1, facing front",
  //   "camera2 3, facing front",
  //   "camera2 5, facing back",
  //   "camera2 4, facing back",
  //   "camera2 2, facing back",
  //  "camera2 0, facing back"]
  public status: string;
  public quickScan = [
    // {
    //   "label": "4K(UHD)",
    //   "width": 3840,
    //   "height": 2160,
    //   "ratio": "16:9"
    // },
    // {
    //   "label": "1080p(FHD)",
    //   "width": 1920,
    //   "height": 1080,
    //   "ratio": "16:9"
    // },
    // {
    //   "label": "UXGA",
    //   "width": 1600,
    //   "height": 1200,
    //   "ratio": "4:3"
    // },
    {
      "label": "720p(HD)",
      "width": 1280,
      "height": 720,
      "ratio": "16:9"
    },
    {
      "label": "SVGA",
      "width": 800,
      "height": 600,
      "ratio": "4:3"
    },
    // {
    //   "label": "VGA",
    //   "width": 640,
    //   "height": 480,
    //   "ratio": "4:3"
    // },
    // {
    //   "label": "360p(nHD)",
    //   "width": 640,
    //   "height": 360,
    //   "ratio": "16:9"
    // }

  ];
  public cam1: any[];
  public DeviceCanUse: {
    deviceId: string,
    resolution: any[]
  }[] = []
  public ResolutionCanUse: ResolutionCanUse[] = [];

  public DeviceArray: string[] = [];
  public d: number = 0;
  public stream: any;
  public i: number = 0;







  constructor(private modalCtrl: ModalController) {

  }

  async ngOnInit() {
    this.Resolution();
    this.checkCamera();
    // this.setCamera();
  }
  async ngAfterViewInit() {
    this.scan();
    console.log(this.DeviceArray.length);
  }

  async checkCamera() {
    const cameras = await this.getConnectedDevices('videoinput');
    if (cameras.length === 0) {
      console.log('No cameras found');
    } else {
      cameras.forEach((camera) => {
        const CameraName = camera.label.toLowerCase();
        if (CameraName.indexOf(this.searchfront) !== -1) {
          const myArray = CameraName.split(",");
          const cameraindex = myArray[0].split(" ");
          this.cameraindexfront = Number.parseInt(cameraindex[1]);
          if (this.cameraindexfront < this.indexCameraF) {
            this.indexCameraF = this.cameraindexfront;
            console.log(this.indexCameraF);
            this.deviceIDsF = camera.deviceId;
            this.deviceNamesF = camera.label;
          }
        }
        if (CameraName.indexOf(this.searchback) !== -1) {
          const myArray = CameraName.split(",");
          const cameraindex = myArray[0].split(" ");
          this.cameraindexfront = Number.parseInt(cameraindex[1]);
          if (this.cameraindexfront < this.indexCameraB) {
            this.indexCameraB = this.cameraindexfront;
            console.log(this.indexCameraB);
            this.deviceIDsB = camera.deviceId;
            this.deviceNamesB = camera.label;
          }
        }
        this.deviceIDs.push(camera.deviceId);
        this.deviceNames.push(camera.label);
        this.devices = this.deviceIDs.map((deviceID, index) => (
          {
            deviceID,
            deviceName: this.deviceNames[index]
          }));
        this.DeviceArray.push(camera.deviceId);
      }
      )
    }
  }

  scan() {
    if (this.i < this.quickScan.length) {
      this.gum(this.quickScan[this.i], this.DeviceArray[this.d]);
      this.displayVideoDimensions();
    }
  }
  gum(candidate: any, device: any) {
    console.log("trying " + candidate.label + " on " + device);
    console.log("trying " + candidate.width + " x " + candidate.height);

    const videoElement = this.video1.nativeElement;
    const stream = videoElement.srcObject as MediaStream;

    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoElement.srcObject = null;
    }

    //create constraints object
    let constraints = {
      video: {
        'deviceId': { 'exact': device },
        'width': { 'min': 640, 'ideal': candidate.width, 'max': 3840 },
        'height': { 'min': 360, 'ideal': candidate.height, 'max': 2160 }
      }
    };

    setTimeout(() => {
      navigator.mediaDevices.getUserMedia(constraints)
        .then((Stream) => {
          this.stream = Stream;
          this.video1.nativeElement.srcObject = Stream;
          this.video1.nativeElement.play()
        })
        .catch(error => {
          console.error('Error accessing media devices.', error);
          this.status = "fail: " + error;
          console.log(this.status);
          this.i++
        });
    },
      (this.stream ? 200 : 0));  //official examples had this at 200

  }
  displayVideoDimensions() {
    console.log('creating...');
    if (!this.video1.nativeElement.videoWidth) {
      setTimeout(() => {
        this.displayVideoDimensions();
      }, 500);
    }
    console.log(this.video1.nativeElement.videoWidth, this.video1.nativeElement.videoHeight);
    console.log(this.quickScan[this.i].width, this.quickScan[this.i].height);
    if (this.video1.nativeElement.videoWidth * this.video1.nativeElement.videoHeight > 0) {
      if (this.quickScan[this.i].width + "x" + this.quickScan[this.i].height === this.video1.nativeElement.videoWidth + "x" + this.video1.nativeElement.videoHeight
        || this.quickScan[this.i].width + "x" + this.quickScan[this.i].height === this.video1.nativeElement.videoHeight + "x" + this.video1.nativeElement.videoWidth) {
        this.status = "pass";
        this.ResolutionCanUse.push({ width: this.quickScan[this.i].width, height: this.quickScan[this.i].height });
        console.log(this.ResolutionCanUse);
        this.i++;
        if (this.i < this.quickScan.length) {
          setTimeout(() => {
            this.scan();
          }, 500);
        }
        else {
          this.i = 0;
          this.DeviceCanUse.push({ deviceId: this.DeviceArray[this.d], resolution: this.ResolutionCanUse });
          this.ResolutionCanUse = [];
          this.d++;
          if (this.d < this.DeviceArray.length) {
            setTimeout(() => {
              this.scan();
            }, 500);
          }
          else {
            this.d = 0;
          }
          console.log(this.DeviceCanUse);
        }
      }
      else {
        this.status = "fail: mismatch";
        this.i++;
        if (this.i < this.quickScan.length) {
          setTimeout(() => {
            this.scan();
          }, 500);
        }
        else {
          this.i = 0;
          this.devices = this.deviceIDs.map((deviceID, index) => (
            {
              deviceID,
              deviceName: this.deviceNames[index]
            }));
          this.d++;
          if (this.d < this.DeviceArray.length) {
            setTimeout(() => {
              this.scan();
            }, 500);
          } else {
            this.d = 0;
          }
        }
      }
      console.log(this.status);
    }
  }

  async openModalFrontCamera() {
    const modal = await this.modalCtrl.create({
      component: FrontCameraComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      // this.message = `Hello, ${data}!`;
    }
  }
  async openModalBackCamera() {
    const modal = await this.modalCtrl.create({
      component: BackCameraComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      // this.message = `Hello, ${data}!`;
    }
  }























































































  frontCamera(value: string) {
    this.closeCamera1();
    console.log(value);
    if (value != "0") {
      this.closeCamera1();
      const stream = this.openCamera(value, this.width1, this.height1);
      stream.then(stream => {
        this.video1.nativeElement.srcObject = stream;
        this.video1.nativeElement.play();
        console.log(this.deviceNamesF)
      })
        .catch(error => {
          console.error('Error accessing media devices.', error);
        });
    } else {
      this.closeCamera1();
    }
  }
  backCamera(value: string) {
    this.closeCamera1();
    console.log(value);
    if (value != "0") {
      this.closeCamera1();
      const stream = this.openCamera(value, this.width1, this.height1);
      stream.then(stream => {
        this.video1.nativeElement.srcObject = stream;
        this.video1.nativeElement.play();
        console.log(this.deviceNamesB);
      })
        .catch(error => {
          console.error('Error accessing media devices.', error);
        });
    } else {
      this.closeCamera1();
    }
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
      this.res1 = this.testRes[5];
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
    console.log(this.width2 + "x" + this.height2);
  }
  onSelectedResolution1(ev: any) {
    this.closeCamera1();
    this.selectedResolution1 = ev.target.value;
    this.Resolution();
    if (ev.target.value != "0") {
      this.closeCamera1();
      const stream = this.openCamera(this.selectedValue1, this.width1, this.height1);
      stream.then(stream => {
        this.video1.nativeElement.srcObject = stream;
        this.video1.nativeElement.play();
      })
        .catch(error => {
          console.error('Error accessing media devices.', error);
        });
    } else {
      this.closeCamera1();
    }
  }
  onSelectedResolution2(ev: any) {
    this.closeCamera2();
    this.selectedResolution2 = ev.target.value;
    this.Resolution();
    if (ev.target.value != "0") {
      this.closeCamera2();
      const stream = this.openCamera(this.selectedValue2, this.width2, this.height2);
      stream.then(stream => {
        this.video2.nativeElement.srcObject = stream;
        this.video2.nativeElement.play();
      })
        .catch(error => {
          console.error('Error accessing media devices.', error);
        });
    } else {
      this.closeCamera2();
    }
  }
  async getConnectedDevices(type: any) {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === type)
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
      this.selectedValue1 = cameras[0].deviceId;
      this.selectedValue2 = cameras[0].deviceId;
      const stream = this.openCamera(cameras[0].deviceId, this.width1, this.height1);
      stream.then(stream => {
        this.video1.nativeElement.srcObject = stream;
        this.video2.nativeElement.srcObject = stream;
        this.video1.nativeElement.play();
        this.video2.nativeElement.play();
        // if (cameras[0].deviceId) {
        //   // this.video1.nativeElement.setAttribute("class", "flip");
        // }
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
  onSelect1(ev: any) {
    this.selectedValue1 = ev.target.value;
    if (ev.target.value != "0") {
      this.closeCamera1();
      const stream = this.openCamera(this.selectedValue1, this.width1, this.height1);
      stream.then(stream => {
        this.video1.nativeElement.srcObject = stream;
        this.video1.nativeElement.play();
      })
        .catch(error => {
          console.error('Error accessing media devices.', error);
        });
    } else {
      this.closeCamera1();
    }
  }
  onSelect2(ev: any) {
    this.selectedValue2 = ev.target.value;
    if (ev.target.value != "0") {
      this.closeCamera2();
      const stream = this.openCamera(this.selectedValue2, this.width2, this.height2);
      stream.then(stream => {
        this.video2.nativeElement.srcObject = stream;
        this.video2.nativeElement.play();
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
      const capturedImage = this.canvas1.nativeElement.toDataURL('image/jpg');
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
  saveImage(capturedImage: string) {
    const createEl = document.createElement('a');
    createEl.href = capturedImage;
    createEl.download = "download.jpg";
    createEl.click();
    createEl.remove();
  }
  public capture2() {
    const context = this.canvas2.nativeElement.getContext('2d');
    if (context) {
      const video2 = this.video2.nativeElement;
      this.canvas2.nativeElement.width = video2.videoWidth;
      this.canvas2.nativeElement.height = video2.videoHeight;
      context.drawImage(this.video2.nativeElement, 0, 0, video2.videoWidth, video2.videoHeight);
      const capturedImage = this.canvas2.nativeElement.toDataURL('image/jpg');
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

  onSelectCamera(ev: any) {
    this.closeCamera1();
    console.log(ev.target.value[0]);
    console.log(ev.target.value[1]);
    if (ev.target.value[0] == 720 || ev.target.value[0] == 1280) {
      this.width1 = 1280;
      this.height1 = 720;
    }
    if (ev.target.value[0] == 800 || ev.target.value[0] == 600) {
      this.width1 = 800;
      this.height1 = 600;
    }
    console.log(this.width1);
    console.log(this.height1);
    const stream = this.openCamera(ev.target.value[1], this.width1, this.height1);
    stream.then(stream => {
      this.video1.nativeElement.srcObject = stream;
      this.video1.nativeElement.play();
    })
      .catch(error => {
        console.error('Error accessing media devices.', error);
      });
  }



}

