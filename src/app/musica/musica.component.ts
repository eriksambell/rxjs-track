import { Component, OnInit, ViewChild } from '@angular/core';
import { interval, Observable, of } from 'rxjs';
import { delay, concatMap, tap, scan, share, map, switchMap } from 'rxjs/internal/operators';

@Component({
  selector: 'app-musica',
  templateUrl: './musica.component.html',
  styleUrls: ['./musica.component.scss']
})
export class MusicaComponent implements OnInit {

  beat$: Observable<number[]> | undefined;
  offbeat$: Observable<number[]> | undefined;
  bpmToMs = 0;

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
    this.beat$ = this.getBassline(this.bpmToMs);
    this.offbeat$ = this.beat$.pipe(
      delay(this.bpmToMs / 2)
    )
  }

  public stopMusica(): void {
    this.beat$ = undefined;
    this.offbeat$ = undefined;
  }

  private getBpmToMs = (bpm: number) => (1000 * 60) / bpm;

  private getBassline(msPerBeat: number): Observable<number[]> {
    return interval(msPerBeat).pipe(
      share(), // turn it multicast, so all subscribers to beat get called up the same time
      concatMap((kick: number) => of(kick).pipe(delay(msPerBeat))),
      map((kick: number) => [kick])
    );    
  }

}

