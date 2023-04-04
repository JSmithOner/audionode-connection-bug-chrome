import { Component, OnInit } from '@angular/core';
import { fromEvent, take, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  context:AudioContext = new (window.AudioContext || ( window as any ).webkitAudioContext)();

  audioMasterDestination:MediaStreamAudioDestinationNode = new MediaStreamAudioDestinationNode( this.context )
  audioMasterStream!:MediaStream;

  audio = new Audio();

  connect = false;

  isInit = false;

  stream!:MediaStreamAudioSourceNode;

  constructor () {

    fromEvent( window, 'mousedown' ).pipe(
      take( 1 ),
      tap( _ => {
        navigator.mediaDevices.getUserMedia({audio: {
          echoCancellation:false,
          autoGainControl:false,
          noiseSuppression:false
        }, video: false })
        .then( async stream => {

          console.log('got stream')

          this.stream = this.context.createMediaStreamSource( stream );

          this.audioMasterStream = this.audioMasterDestination.stream;

          this.audio.srcObject = this.audioMasterStream;

          await this.audio.play();

          this.isInit = true;

        } )

      } )

    ).subscribe()

  }

  toggleConnect = () => {

    if ( this.connect ) {

      this.stream.disconnect( this.audioMasterDestination );

    } else {

      console.log('connect', this.stream, this.audioMasterDestination )

      this.stream.connect( this.audioMasterDestination );

    }

    this.connect = !this.connect;

  }

  ngOnInit(): void {

  }

}

