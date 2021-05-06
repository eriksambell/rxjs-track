import { Component, OnInit } from '@angular/core';
import { from, of } from 'rxjs';
import { delay, mergeMap, concatMap } from 'rxjs/internal/operators';

@Component({
  selector: 'app-musica',
  templateUrl: './musica.component.html',
  styleUrls: ['./musica.component.scss']
})
export class MusicaComponent implements OnInit {

  bassline: string[] = [];

  constructor() { }

  ngOnInit(): void {
    this.getBassline();
  }

  getBassline() {
    for (let i = 0; i < 100; i++) this.bassline.push('bass');

    const bpm = 130;
    const interval = 60 / bpm * 1000;

    of(this.bassline).pipe(
      mergeMap((bass: any) => from(bass)),
      concatMap(x => of(x).pipe(delay(interval)))
    ).subscribe(y => console.log(y));
  }



}

