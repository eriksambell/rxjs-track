import { Component, OnInit, ViewChild } from '@angular/core';
import { from, interval, Observable, of } from 'rxjs';
import { delay, mergeMap, concatMap, share, concatAll, tap } from 'rxjs/internal/operators';

@Component({
  selector: 'app-musica',
  templateUrl: './musica.component.html',
  styleUrls: ['./musica.component.scss']
})
export class MusicaComponent implements OnInit {

  bassline: string[] = [];
  beat$: any;

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

    this.beat$ = this.getBassline(this.bpmToMs(100));
  }

  private bpmToMs = (bpm: number) => (1000 * 60) / bpm;

  public getBassline(msPerBeat: number): Observable<string> {
    for (let i = 0; i < 100; i++) this.bassline.push('bass');

    return of(this.bassline).pipe(
      concatAll(),
      concatMap((bass: string) => of(bass).pipe(delay(msPerBeat))),
      tap(hee => console.log(hee)),
    );
  }



}

