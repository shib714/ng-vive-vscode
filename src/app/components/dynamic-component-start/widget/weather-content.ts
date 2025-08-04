import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { interval } from "rxjs";

@Component({
  selector: "weather-content",
  standalone: true,
  imports   : [CommonModule],
  template: `
    <div>Full weather condition details, extended forecast, etc.</div>
    <div>Sky Condition: ☀️</div>  
    <div>Temperature: {{temperature}}°C</div>
    <div>Last Updated At: {{lastUpdateAt | date: 'medium'}}</div>
  `,
})
export class WeatherContent {
  lastUpdateAt: Date = new Date();

  protected temperature = 21;

  #polling = interval(5000).pipe(takeUntilDestroyed());

  ngOnInit() {
    this.#polling.subscribe(() => (this.lastUpdateAt = new Date()));
  }
}