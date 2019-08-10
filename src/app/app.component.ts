import { Component, NgZone, OnInit, ViewChild, ElementRef, OnChanges,AfterViewChecked, AfterViewInit } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import * as $ from 'jquery';
declare const UnityLoader;
declare const UnityProgress;
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit, OnInit, OnChanges {
	private recordRTC: any;
	gameInstance: any;
	gameObject: any;
	unity: any;
	grabador: any;
	elemento: any;
	UrlSrc:string;
	rec: boolean;
	stop: boolean
	down: boolean;
	blb: any;
	width: any;
	height: any;
	@ViewChild('video') video: ElementRef;
	@ViewChild('todo') elementView: ElementRef;
	@ViewChild('canvas') canvas: ElementRef;
    viewHeight: number;


	constructor(
			private ngZone: NgZone, 
			private todo:ElementRef,
            private client_http: HttpClient
		) {
		this.unity = this.unity || {};
		this.unity.GetUnityNumber = this.randomNumberFromUnity.bind(this);
	}

	public ngOnInit(): void {
		this.rec = false;
		this.stop = true;
		this.down = true;
		this.init();
	}

	ngOnChanges() {

	}

	ngAfterViewInit() {
	}

	ngAfterViewChecked() {
		
	} 

	async CrearReplay(dato) {
        //const headers = new HttpHeaders().set('Content-Type', 'application/json;');
        await this.client_http.post(
        	'/replay/crear',
        	{
        		file: dato
        	}
        );
    }

	onResize(event) {
		//console.log(document.getElementById('simu').offsetWidth);
		console.log(event.target.innerWidth);
		console.log(event.target.innerHeight);

		this.width = (event.target.innerHeight * 30) / 100; 
		this.height = (event.target.innerHeight * 30) / 100;
		console.log("waaa: " + document.getElementById("#canvas").offsetWidth);
		//document.getElementById("#canvas").style.width = this.width;
		//document.getElementById("#canvas").style.height = this.width;
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
            	//recorderType: RecordRTC.CanvasRecorder, 
            	showMousePointer: true
        	}
        );
		this.grabador.startRecording();
		this.rec = true;
		this.stop = false;
		this.down = true;
	}

	async detener() {
		await this.grabador.stopRecording(
			function () {
				let video: HTMLVideoElement = document.querySelector('video');
		    	video.src = this.toURL();
		    	this.UrlSrc = this.toURL();
				this.blb = this.getBlob();
			}
		);

	
		let blob = await this.grabador.getBlob();
		console.log(blob);

		this.rec = false;
		this.stop = true;
		this.down = false;
	}

	descargar() {
		this.grabador.save('video.webm');
		this.rec = true;
		this.stop = true;
		this.down = false;
		console.log(this.grabador.getBlob());
		this.CrearReplay(this.grabador.getBlob());

		var file = new File(
			[this.grabador.getBlob()], 
			'filename.webm', {
		        type: 'video/webm'
		    }
		);


		let formData = new FormData(); 
		formData.append(
			"replay_unity", 
			file,
			"video.webm"
		);

	}

	replay() {

	}
}