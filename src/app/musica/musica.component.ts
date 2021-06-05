import { Component, OnInit } from '@angular/core';
import { interval, Observable, of, Subject } from 'rxjs';
import { delay, concatMap, share, map, filter, takeUntil } from 'rxjs/internal/operators';

type MusicLabel = 'beat' | 'claps' | 'melody' | 'hiHat';

@Component({
  selector: 'app-musica',
  templateUrl: './musica.component.html',
  styleUrls: ['./musica.component.scss']
})
export class MusicaComponent implements OnInit {

  beat$: Observable<number> | undefined;
  claps$: Observable<number> | undefined;
  melody$: Observable<number> | undefined;
  hiHats$: Observable<number> | undefined;
  
  bpmToMs = 0;

  music = {
    beat: {
      volume: 80,
      sample: 'kick.wav'
    },
    claps: {
      volume: 25,
      sample: 'hh-closed.wav'
    },
    hiHat: {
      volume: 25,
      sample: 'hh-open.wav'
    },
    melody: {
      volume: 25,
      sample: 'big-room-bass-line_125bpm_D.wav'
    },
  }

  destroy$ = new Subject<void>();

  ngOnInit(): void {
    /**
     * convert ms per beat
     * one tricky thing is dealing with unicast vs multicast observables.
     * An interval actually starts a new time source for every subscription, meaning it's unicast.
     */
    this.bpmToMs = this.getBpmToMs(125);
    this.startMusica();
  }

  public startMusica(): void {

    this.beat$ = this.getBassline(this.bpmToMs).pipe(
      takeUntil(this.destroy$),
      share() // turn it multicast, so all subscribers to beat get called up the same time
    );

    this.claps$ = this.beat$.pipe(
      filter((val, index) => index % 2 === 0),
      map((halfbeat: number, index: number) => index)
    )

    this.melody$ = this.beat$.pipe(
      filter((val, index) => index % 16 === 0),
    )

    this.hiHats$ = this.beat$.pipe(
      delay(this.bpmToMs / 2)
    )


    this.beat$.subscribe(() => this.createAudio('beat'));
    this.claps$.subscribe(() => this.createAudio('claps'));
    this.hiHats$.subscribe(() => this.createAudio('hiHat'));
    this.melody$.subscribe(() => this.createAudio('melody'));
  }

  public stopMusica(): void {
    this.destroy$.next();
  }

  private getBpmToMs = (bpm: number) => (1000 * 60) / bpm;

  private getBassline(msPerBeat: number): Observable<number> {
    return interval(msPerBeat).pipe(
      concatMap((kick: number) => of(kick).pipe(delay(msPerBeat)))
    );
  }

  private createAudio(label: MusicLabel) {
    let audio = new Audio();
    audio.src = `../../assets/samples/${this.music[label].sample}`
    audio.volume = this.music[label].volume / 100;
    audio.play()
  }

  public setVolume(volume: string, label: MusicLabel) {
    this.music[label].volume = Number(volume);
  }

}

