import { Component, OnInit } from '@angular/core';
import { interval, Observable, of, Subject } from 'rxjs';
import { delay, concatMap, share, map, filter, takeUntil } from 'rxjs/internal/operators';

@Component({
  selector: 'app-musica',
  templateUrl: './musica.component.html',
  styleUrls: ['./musica.component.scss']
})
export class MusicaComponent implements OnInit {

  beat$: Observable<number> | undefined;
  halfBeat$: Observable<number> | undefined;
  offBeat$: Observable<number> | undefined;
  
  bpmToMs = 0;
  volume = {
    beat: 50,
    half: 50,
    off: 50
  }

  destroy$ = new Subject<void>();

  ngOnInit(): void {
    /**
     * convert ms per beat
     * one tricky thing is dealing with unicast vs multicast observables.
     * An interval actually starts a new time source for every subscription, meaning it's unicast.
     */
    this.bpmToMs = this.getBpmToMs(120);
  }

  public startMusica(): void {

    this.beat$ = this.getBassline(this.bpmToMs).pipe(
      takeUntil(this.destroy$),
      share() // turn it multicast, so all subscribers to beat get called up the same time
    );

    this.halfBeat$ = this.beat$.pipe(
      filter((val, index) => index % 2 === 0),
      map((halfbeat: number, index: number) => index)
    )

    this.offBeat$ = this.beat$.pipe(
      delay(this.bpmToMs / 2)
    )

    this.beat$.subscribe(() => this.createAudio('kick', this.volume.beat));
    this.halfBeat$.subscribe(() => this.createAudio('hh-closed', this.volume.half));
    this.offBeat$.subscribe(() => this.createAudio('TechDHitB-21', this.volume.off));
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

  private createAudio(fileName: string, volume: number) {
    let audio = new Audio();
    audio.src = `../../assets/samples/${fileName}.wav`
    audio.volume = volume / 100;
    audio.play();
  }

  public setVolume(volume: string, part: 'beat' | 'half' | 'off') {
    this.volume[part] = Number(volume);
  }

}

