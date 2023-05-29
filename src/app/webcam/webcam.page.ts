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
  @ViewChild('video', { static: false })
  public video: ElementRef<HTMLVideoElement>;
  @ViewChild('video2', { static: false })
  public video2: ElementRef<HTMLVideoElement>;

  @ViewChild('canvas', { static: false })
  public canvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('image', { static: false })
  public image: ElementRef<HTMLImageElement>;

  @ViewChild('liveLiew', { static: false })
  public liveView: ElementRef<HTMLDivElement>;

  constructor() { }
  images: { 
    imageW: number,
    imageH: number,
    imageC: string, 
    imageT: string 
  }[] = [];

  deviceIDs: string[] = [];
  deviceNames: string[] = [];
  devices: { deviceID: string, deviceName: string }[] = [];
  selectedValue: string;
  selectedResolution : string;
  captures: string[] = [];
  showResolutionWidth: number[] = [];
  showResolutionheight: number[] = [];
  res: string;
  testRes: string[] = ['nHD', 'VGA', 'SVGA', 'HD', 'UXGA', 'FHD', 'UHD'];
  width: number;
  height: number;
  i: number = 3;

  score: number;
  faceDetector: FaceDetector;

  async initialization() {
    const vision = await FilesetResolver.forVisionTasks(
      // path/to/wasm/root
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    console.log("vision", vision);
    console.log("image", this.image);
    this.faceDetector = await FaceDetector.createFromOptions(
      vision,
      {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`
        },
        runningMode: 'VIDEO'
      });
    console.log("faceDetector", this.faceDetector);
  }

  async handleClick() {
    const resultElement = this.image.nativeElement;

    const faceDetectorResult = this.faceDetector.detect(this.image.nativeElement);
    console.log(faceDetectorResult.detections);

    faceDetectorResult.detections.forEach((detection) => {

      const ratio = 1;
      // this.canvas.nativeElement.height / this.canvas.nativeElement.naturalHeight;

      console.log('height', this.image.nativeElement.height);
      // console.log('naturalHeight', this.canvas.nativeElement.naturalHeight);
      console.log('ratio', ratio);
      console.log(detection.categories[0].score);
      this.score = Number(detection.categories[0].score);
      console.log(detection.boundingBox?.originX);

      const p = document.createElement("p");
      p.setAttribute("class", "info");
      p.innerText = "Confidence: " + Math.round(this.score * 100) + "%";
      p.style.cssText = `
                          color : #fff; 
                          position: absolute;
                          left : ${Number(detection.boundingBox?.originX) }px;
                          top : ${Number(detection.boundingBox?.originY) }px;
                          width : ${Number(detection.boundingBox?.width) }px;
                          height : 20px;
                           `
      const highlighter = document.createElement("div");
      highlighter.setAttribute("class", "highlighter");
      highlighter.style.cssText = `
                          background: rgba(0, 255, 0, 0.25);
                          border: 1px dashed #fff;
                          z-index: 1;
                          position: absolute;
                          opacity: 0.3;
                          left : ${Number(detection.boundingBox?.originX) }px;
                          top : ${Number(detection.boundingBox?.originY) }px;
                          width : ${Number(detection.boundingBox?.width) }px;
                          height : ${Number(detection.boundingBox?.height)}px;
                           `;
      resultElement.parentNode?.appendChild(highlighter);
      resultElement.parentNode?.appendChild(p);
      detection.keypoints?.forEach((keypoint) => {
        const keypointEl = document.createElement("spam");
        keypointEl.className = "key-point";
        keypointEl.style.cssText = `
                          position: absolute;
                          z-index: 1;
                          width: 3px;
                          height: 3px;
                          background-color: #ff0000;
                          border-radius: 50%;
                          display: block;
                          left : ${keypoint.x * resultElement.width - 3}px;
                          top : ${keypoint.y * resultElement.height - 3}px;
                           `
        resultElement.parentNode?.appendChild(keypointEl);
      })
    })
  }
  children = [];
  displayVideoDetections(detections: Detection[]){
    for (let child of this.children) {
      this.liveView.nativeElement.removeChild(child);
    }
    this.children.splice(0);
    const resultElement = this.liveView.nativeElement;

    // const faceDetectorResult = this.faceDetector.detect(this.video.nativeElement);
    // console.log(faceDetectorResult.detections);

    detections.forEach((detection) => {

      // const ratio = 1;
      // this.canvas.nativeElement.height / this.canvas.nativeElement.naturalHeight;

      console.log('height', this.video.nativeElement.height);
      // console.log('naturalHeight', this.canvas.nativeElement.naturalHeight);
      // console.log('ratio', ratio);
      console.log(detection.categories[0].score);
      this.score = Number(detection.categories[0].score);
      console.log(detection.boundingBox?.originX);

      const p = document.createElement("p");
      p.setAttribute("class", "info");
      p.innerText = "Confidence: " + Math.round(this.score * 100) + "%";
      p.style.cssText = `
                          color : #fff; 
                          position: absolute;
                          left : ${Number(detection.boundingBox?.originX)}px;
                          top : ${Number(detection.boundingBox?.originY)}px;
                          width : ${Number(detection.boundingBox?.width)}px;
                          height : 20px;
                           `
      const highlighter = document.createElement("div");
      highlighter.setAttribute("class", "highlighter");
      highlighter.style.cssText = `
                          background: rgba(0, 255, 0, 0.25);
                          border: 1px dashed #fff;
                          z-index: 1;
                          position: absolute;
                          opacity: 0.3;
                          left : ${Number(detection.boundingBox?.originX)}px;
                          top : ${Number(detection.boundingBox?.originY) }px;
                          width : ${Number(detection.boundingBox?.width) }px;
                          height : ${Number(detection.boundingBox?.height)}px;
                           `;
      resultElement.parentNode?.appendChild(highlighter);
      resultElement.parentNode?.appendChild(p);
      detection.keypoints?.forEach((keypoint) => {
        const keypointEl = document.createElement("spam");
        keypointEl.className = "key-point";
        keypointEl.style.cssText = `
                          position: absolute;
                          z-index: 1;
                          width: 3px;
                          height: 3px;
                          background-color: #ff0000;
                          border-radius: 50%;
                          display: block;
                          left : ${keypoint.x * resultElement.offsetWidth - 3}px;
                          top : ${keypoint.y * resultElement.offsetHeight - 3}px;
                           `
        resultElement.parentNode?.appendChild(keypointEl);
      })
    })
  }
  lastVideoTime = -1;
  async videoDetector() {
    let startTimeMs = performance.now();
    if (this.video.nativeElement.currentTime !== this.lastVideoTime) {
      this.lastVideoTime = this.video.nativeElement.currentTime;
      const detections = this.faceDetector.detectForVideo(this.video.nativeElement, startTimeMs)
        .detections;
      this.displayVideoDetections(detections);
    }
    window.requestAnimationFrame(this.videoDetector);
  }

























  async ngOnInit() {
    // this.getmediaDevices();
    this.Resolution();
    this.checkCamera();
    this.setCamera();
    this.initialization();
    // this.initializefaceDetector();
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
        this.devices = this.deviceIDs.map((deviceID, index) => ({
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
        'width': { 'min': 640, 'ideal': minWidth, 'max': 3840 },
        'height': { 'min': 480, 'ideal': minHeight, 'max': 2160 }
      }
    }
    return await navigator.mediaDevices.getUserMedia(constraints);
  }

  async setCamera() {
    const cameras = await this.getConnectedDevices('videoinput');
    if (cameras && cameras.length > 0) {
      const stream = this.openCamera(cameras[0].deviceId, this.width, this.height);
      stream.then(stream => {
        console.log('Got MediaStream:', stream);
        this.video.nativeElement.srcObject = stream;
        this.video2.nativeElement.srcObject = stream;
        console.log('Got currentTime:', this.video.nativeElement.currentTime);
        this.video.nativeElement.addEventListener('loadeddata', () => {
          this.videoDetector();
        });
        this.video.nativeElement.play();
        this.video2.nativeElement.play();
        console.log(this.video);
      })
        .catch(error => {
          console.error('Error accessing media devices.', error);
        });
    }
  }
  onSelectedResolution(value: string) {
    this.selectedResolution = value;
    console.log(this.selectedResolution);
    if (this.selectedResolution == "1") {
      this.res = this.testRes[0];
      this.Resolution();
    }
    if (this.selectedResolution == "2") {
      this.res = this.testRes[1];
      this.Resolution();
    }
    if (this.selectedResolution == "3") {
      this.res = this.testRes[2];
      this.Resolution();
    }
    if (this.selectedResolution == "4") {
      this.res = this.testRes[3];
      this.Resolution();
    }
    if (this.selectedResolution == "5") {
      this.res = this.testRes[5];
      this.Resolution();
    }
    this.onSelect(this.selectedValue);
  }
  onSelect(value: string) {
    this.selectedValue = value;
    if (value != "0") {
      this.closeCamera();
      console.log(this.selectedValue);
      const stream = this.openCamera(this.selectedValue, this.width, this.height);
      stream.then(stream => {
        console.log('Got MediaStream:', stream);
        this.video.nativeElement.srcObject = stream;
        console.log('Got currentTime:', this.video.nativeElement.currentTime);
        // this.video.nativeElement.addEventListener("loadeddata", this.predictWebcam);
        this.video.nativeElement.play();
        console.log(this.video);
      })
        .catch(error => {
          console.error('Error accessing media devices.', error);
        });
    } else {
      this.closeCamera();
    }
  }

  closeCamera() {
    const videoElement = this.video.nativeElement;
    const stream = videoElement.srcObject as MediaStream;

    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoElement.srcObject = null;
    }
  }

  public capture() {
    const context = this.canvas.nativeElement.getContext('2d');
    if (context) {
      const video = this.video.nativeElement;
      this.canvas.nativeElement.width = video.videoWidth;
      this.canvas.nativeElement.height = video.videoHeight;
      context.drawImage(this.video.nativeElement, 0, 0, video.videoWidth, video.videoHeight);
      const capturedImage = this.canvas.nativeElement.toDataURL('image/jpeg');
      console.error(this.canvas);
      this.captures.push(capturedImage);
      this.showResolutionWidth.push(this.canvas.nativeElement.width);
      this.showResolutionheight.push(this.canvas.nativeElement.height);
      this.images = this.showResolutionWidth.map((imageW, index) => ({
        imageW,
        imageH: this.showResolutionheight[index],
        imageC: this.captures[index],
        imageT: 'jpeg'
      }));
      this.handleClick();
    } else {
      console.error('Canvas context is null.');
    }
  }

  iplus() {
    if (this.i < 7) {
      this.i++;
    }
    if (this.i >= 7) {
      this.i = 0;
    }
    console.log(this.i);
    this.Resolution();
    this.closeCamera();
    this.onSelect(this.selectedValue)
  }
  Resolution() {
    if (this.res == 'UHD') {
      this.width = 3840;
      this.height = 2160;
      console.log(this.width + "x" + this.height);
    }
    if (this.res == 'FHD') {//
      this.width = 1920;
      this.height = 1080;
      console.log(this.width + "x" + this.height);
    }
    if (this.res == 'UXGA') {
      this.width = 1600;
      this.height = 1200;
      console.log(this.width + "x" + this.height);
    }
    if (this.res == 'HD') {//
      this.width = 1280;
      this.height = 720;
      console.log(this.width + "x" + this.height);
    }
    if (this.res == 'SVGA') {//
      this.width = 800;
      this.height = 600;
      console.log(this.width + "x" + this.height);
    }
    if (this.res == 'VGA') {//
      this.width = 640;
      this.height = 480;
      console.log(this.width + "x" + this.height);
    }
    if (this.res == 'nHD') {//
      this.width = 640;
      this.height = 360;
      console.log(this.width + "x" + this.height);
    }
  }
}

