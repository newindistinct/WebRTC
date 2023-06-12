import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebcamService {
  public searchfront: string = "front";
  public searchback: string = "back";
  public cameraindexfront: number;
  public indexCameraF: number = 10;
  public indexCameraB: number = 10;
  public myFrontCamera: any[] = [];
  public myBackCamera: any[] = [];
  public deviceIDs: string[] = [];
  public deviceNames: string[] = [];
  public deviceIDsF: string;
  public deviceNamesF: string;
  public deviceIDsB: string;
  public deviceNamesB: string;
  public devices: { deviceID: string, deviceName: string }[] = []
  public DeviceArray: string[] = [];
  constructor() { }

  async getConnectedDevices(type: any) {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === type)
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
}
