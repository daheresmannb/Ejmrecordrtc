import { Component, NgZone, OnInit, ViewChild, ElementRef, OnChanges, AfterViewInit } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import * as $ from 'jquery';
declare const UnityLoader;
declare const UnityProgress;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit, OnInit, OnChanges {
	private stream: MediaStream;
	private recordRTC: any;
	gameInstance: any;
	public gameObject: any;
	public unity: any;
	public grabador: any;
	public elemento: any;
	public video2: HTMLVideoElement;
	ax: RecordRTC.CanvasRecorder;
	UrlSrc:string;
	

	@ViewChild('video') video: ElementRef;

	constructor(private ngZone: NgZone) {
		this.unity = this.unity || {};
		this.unity.GetUnityNumber = this.randomNumberFromUnity.bind(this);
	}

	public ngOnInit(): void {
		this.init();
	}

	ngOnChanges() {

	}

	ngAfterViewInit() {

	}



	private init() {
		console.log("init");
		$.when(
		    $.getScript("assets/webgl/Build/UnityLoader.js"),
			$.getScript("assets/webgl/TemplateData/UnityProgress.js")

		).done(
			function () {
				this.gameObject = UnityLoader.instantiate(
	            	"gameContainer", 
	            	"assets/webgl/Build/HTML.json", {
	                	onProgress: UnityProgress
	            	}
	        	);
			}
		);
	}

	private randomNumberFromUnity(input: string) {
		this.ngZone.run(() => {
			//console.log('call from unity', input);
		});
	}


	toggleVideo(event: any) {
	    this.video.nativeElement.play();
	}



	grabar() {
		/*
			var elementToShare = document.getElementById('elementToShare'); 
			var canvasRecorder = RecordRTC(
				elementToShare,{ 
					type : 'canvas', 
					recorderType: CanvasRecorder 
				}
			);
		*/

		/*
			this.elemento = document.querySelector('canvas');
	        this.grabador = RecordRTC(
	        	this.elemento, {
	            	type: 'canvas',
	            	showMousePointer: true
	        	}
	        );
		*/
		this.elemento = document.querySelector('canvas');
        this.grabador = RecordRTC(
        	this.elemento, {
            	type: 'canvas',
            	recorderType: RecordRTC.CanvasRecorder, 
            	showMousePointer: true
        	}
        );
		this.grabador.startRecording();
	}

	detener() {
		this.grabador.stopRecording(
			function () {
				let video: HTMLVideoElement = document.querySelector('video');
		    	video.src = this.toURL();
		    	this.UrlSrc = this.toURL();
		    	 
			}
		);
	}



	descargar() {
		this.grabador.save('video.webm');
	}
}