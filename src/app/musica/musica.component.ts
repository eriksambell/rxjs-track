import { Component, OnInit } from '@angular/core';
import { interval, Observable, of } from 'rxjs';
import { delay, concatMap, tap, scan, share, map } from 'rxjs/internal/operators';

@Component({
  selector: 'app-musica',
  templateUrl: './musica.component.html',
  styleUrls: ['./musica.component.scss']
})
export class MusicaComponent implements OnInit {

  beat$: Observable<number[]> | undefined;

  constructor() { }

  ngOnInit(): void {
    /**
     * convert ms per beat
     * one tricky thing is dealing with unicast vs multicast observables.
     * An interval actually starts a new time source for every subscription, meaning it's unicast.
     */
  }

  private bpmToMs = (bpm: number) => (1000 * 60) / bpm;

  private getBassline(msPerBeat: number): Observable<number[]> {
    return interval(msPerBeat).pipe(
      share(), // turn it multicast, so all subscribers to beat get called up the same time
      concatMap((kick: number) => of(kick).pipe(delay(msPerBeat))),
      map((kick: number) => [kick])
    );    
  }

  public startMusica(bpm: 140): void {
    this.beat$ = this.getBassline(this.bpmToMs(bpm));
  }

  public stopMusica(): void {
    this.beat$ = undefined;
  }

}

