import { Component } from '@angular/core';
import { interval, Observable, Subject } from 'rxjs';
import { delay, share, filter, takeUntil } from 'rxjs/internal/operators';

type Sample = 'beat' | 'claps' | 'melody' | 'hiHat';

@Component({
  selector: 'app-musica',
  templateUrl: './musica.component.html',
  styleUrls: ['./musica.component.scss'],
})
export class MusicaComponent {
  music = {
    beat: { volume: 80, sample: 'kick.wav' },
    claps: { volume: 25, sample: 'hh-closed.wav' },
    hiHat: { volume: 25, sample: 'hh-open.wav' },
    melody: { volume: 40, sample: 'big-room-bass-line_125bpm_D.wav' },
  };

  destroy$ = new Subject<void>();

  /**
   * The beat is created from an interval, which actually starts a new time source for every subscription, meaning it's unicast.
   * So we use share() to turn it multicast, so all subscribers to the beat get called up the same time
   */
  public startMusic(): void {
    // convert bpm to milliseconds per beat
    const msPerBeat = this.bpmToMs(125);

    // create observables
    const beat$: Observable<number> = interval(msPerBeat).pipe(takeUntil(this.destroy$), share());

    const claps$: Observable<number> = beat$.pipe(filter((_, index) => index % 2 === 0));
    const hiHats$: Observable<number> = beat$.pipe(delay(msPerBeat / 2));
    const melody$: Observable<number> = beat$.pipe(filter((_, index) => index % 16 === 0));

    // subscribe to observables and create audio
    beat$.subscribe(() => this.createAudio('beat'));
    claps$.subscribe(() => this.createAudio('claps'));
    hiHats$.subscribe(() => this.createAudio('hiHat'));
    melody$.subscribe(() => this.createAudio('melody'));
  }

  public stopMusic(): void {
    this.destroy$.next();
  }

  public setVolume(volume: string, label: Sample): void {
    this.music[label].volume = Number(volume);
  }

  private bpmToMs = (bpm: number): number => (1000 * 60) / bpm;

  private createAudio(label: Sample): void {
    const audio = new Audio();
    audio.src = `assets/samples/${this.music[label].sample}`;
    audio.volume = this.music[label].volume / 100;
    audio.play();
  }
}
