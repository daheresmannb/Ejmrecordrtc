import { Component, NgZone, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import * as $ from 'jquery';
declare const UnityLoader;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})


export class AppComponent implements AfterViewInit, OnInit {
	private stream: MediaStream;
	private recordRTC: any;
	gameInstance: any;
	public gameObject: any;
	public unity: any;
	@ViewChild('video') video;

	constructor(private ngZone: NgZone) {
		this.unity = this.unity || {};
		this.unity.GetUnityNumber = this.randomNumberFromUnity.bind(this);
	}

	public ngOnInit(): void {
		this.init();
	}

	ngAfterViewInit() {
		console.log("ngAfterViewInit!!!!!");
		// estado inicial del video
		let video:HTMLVideoElement = this.video.nativeElement;
		video.muted = false;
		video.controls = true;
		video.autoplay = false;
	}

	public helloUnity() {
		console.log(this.gameObject); // <-- always undefined ?
		this.gameObject.SendMessage('SetText', 'HELLO?');
	}

	private init() {
		console.log("init");
		$.getScript('assets/webgl/Build/UnityLoader.js').done(
			function ( bla , text) {
				this.gameObject = UnityLoader.instantiate(
	            	"gameContainer", 

	            	
	            	"assets/webgl/Build/HTML.json", {
	                	//onProgress: UnityProgress
	            	}
	        	);
			//gameObject not undefined at this stage..
			}
		);
	}
	private randomNumberFromUnity(input: string) {
		this.ngZone.run(() => {
			console.log('call from unity', input);
		});
	}

	toggleControls() {
		console.log("toggleControls!!!!!");
		let video: HTMLVideoElement = this.video.nativeElement;
		video.muted = !video.muted;
		video.controls = !video.controls;
		video.autoplay = !video.autoplay;
	}

	successCallback(stream: MediaStream) {
		console.log("successCallback!!!!!");
		var options = {
			mimeType: 'video/webm', 
			audioBitsPerSecond: 128000,
			videoBitsPerSecond: 128000,
			bitsPerSecond: 128000 
		};
		this.stream = stream;
		this.recordRTC = RecordRTC(
			stream, 
			options
		);
		this.recordRTC.startRecording();
		let video: HTMLVideoElement = this.video.nativeElement;
		video.src = window.URL.createObjectURL(stream);
		this.toggleControls();
	}

	errorCallback() {
		console.log("errorCallback!!!!!");
	}

	processVideo(audioVideoWebMURL) {
		console.log("processVideo!!!!!");
		let video: HTMLVideoElement = this.video.nativeElement;
		let recordRTC = this.recordRTC;
		video.src = audioVideoWebMURL;
		this.toggleControls();
		var recordedBlob = recordRTC.getBlob();
		recordRTC.getDataURL(function (dataURL) { 
			//console.log(dataURL);
		});
	}

	startRecording() {
		console.log("startRecording!!!!!");
		let mediaConstraints = {
			video: false
		};

		navigator.mediaDevices
		.getUserMedia(
			mediaConstraints
		).then(
			this.successCallback.bind(this), 
			this.errorCallback.bind(this)
		);
	}

	stopRecording() {
		console.log("stopRecording!!!!!");
		let recordRTC = this.recordRTC;
		recordRTC.stopRecording(
			this.processVideo.bind(this)
		);
		let stream = this.stream;
		stream.getAudioTracks().forEach(
			track => track.stop()
		);
		stream.getVideoTracks().forEach(
			track => track.stop()
		);
	}

	download() {
		this.recordRTC.save('video.webm');
	}
}