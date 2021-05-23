import { Component, OnInit } from '@angular/core';
import { interval, Observable, of, Subject } from 'rxjs';
import { delay, concatMap, share, map, filter, takeUntil } from 'rxjs/internal/operators';

@Component({
  selector: 'app-musica',
  templateUrl: './musica.component.html',
  styleUrls: ['./musica.component.scss']
})
export class MusicaComponent implements OnInit {

  beat$: Observable<number[]> | undefined;
  halfbeat$: Observable<number[]> | undefined;
  offbeat$: Observable<number[]> | undefined;
  bpmToMs = 0;
  volume = 1.0;

  destroy$ = new Subject<void>();

  ngOnInit(): void {
    /**
     * convert ms per beat
     * one tricky thing is dealing with unicast vs multicast observables.
     * An interval actually starts a new time source for every subscription, meaning it's unicast.
     */
    this.bpmToMs = this.getBpmToMs(120);
    this.startMusica();
  }

  public startMusica(): void {
    this.beat$ = this.getBassline(this.bpmToMs).pipe(
      takeUntil(this.destroy$),
      share() // turn it multicast, so all subscribers to beat get called up the same time
    );
    this.halfbeat$ = this.beat$.pipe(
      filter((val, index) => index % 2 === 0),
      // delay(this.bpmToMs / 2), // add half off beat
      map((halfbeat: number[]) => [halfbeat[0] / 2])
    )
    this.offbeat$ = this.beat$.pipe(
      delay(this.bpmToMs / 2)
    )

    this.beat$.subscribe(() => this.createAudio('kick'));
    this.halfbeat$.subscribe(() => this.createAudio('hh-closed'));
    this.offbeat$.subscribe(() => this.createAudio('TechDHitB-21'));
  }

  public stopMusica(): void {
    this.destroy$.next();
  }

  private getBpmToMs = (bpm: number) => (1000 * 60) / bpm;

  private getBassline(msPerBeat: number): Observable<number[]> {
    return interval(msPerBeat).pipe(
      share(), // turn it multicast, so all subscribers to beat get called up the same time
      concatMap((kick: number) => of(kick).pipe(delay(msPerBeat))),
      map((kick: number) => [kick])
    );
  }

  private createAudio(fileName: string) {
    let audio = new Audio();
    audio.src = `../../assets/samples/${fileName}.wav`
    audio.volume = this.volume;
    audio.play();
  }

  public setVolume(volume: string) {
    this.volume = Number(volume);
  }

}

