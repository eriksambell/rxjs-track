import { Component, OnInit } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { delay, concatMap, tap, scan } from 'rxjs/internal/operators';

@Component({
  selector: 'app-musica',
  templateUrl: './musica.component.html',
  styleUrls: ['./musica.component.scss']
})
export class MusicaComponent implements OnInit {

  bassline: number[] = [];
  beat$: Observable<number[]> | undefined;

  constructor() { }

  ngOnInit(): void {
    /**
     * convert ms per beat
     * one tricky thing is dealing with unicast vs multicast observables.
     * An interval actually starts a new time source for every subscription, meaning it's unicast.
     */

    // this.beat$ = interval(msPerBeat).pipe(
    //   share(), // turn it multicast, so all subscribers to beat get called up the same time
    // )

    this.beat$ = this.getBassline(this.bpmToMs(140)).pipe(tap(console.log));
  }

  private bpmToMs = (bpm: number) => (1000 * 60) / bpm;

  public getBassline(msPerBeat: number): Observable<number[]> {
    for (let i = 0; i < 100; i++) this.bassline.push(i + 1);

    return from(this.bassline).pipe(
      concatMap((bass: number) => of(bass).pipe(delay(msPerBeat))),
      scan((acc, value) => [...acc, value], [] as number[])
    );    

  }



}

