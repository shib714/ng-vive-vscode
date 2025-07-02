import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { interval } from 'rxjs';

@Component({
  selector: 'weather-content',
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="sky-condition"> Sky Condition: 
      <mat-icon aria-hidden="false" aria-label="sunny icon" fontIcon="sunny"></mat-icon>
    </div>
    <div class="temperature">Temperature: {{temperature}}°C</div>
    <div class="temperature">Last Updated At: : {{lastUpdateAt | date}}</div>
  `
})
export class WeatherContent {
  lastUpdateAt: Date = new Date();

  protected temperature = 21;

  #polling = interval(5000).pipe(takeUntilDestroyed())

  ngOnInit() {
    this.#polling.subscribe(() =>
        this.lastUpdateAt = new Date()
    )
  }

  ngOnDestroy() {
    console.log('Weather Content Is Destroyed...');
  }

}