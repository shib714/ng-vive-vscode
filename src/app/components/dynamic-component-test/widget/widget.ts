import { CommonModule } from '@angular/common';
import { Component, computed, input, model, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { interval } from 'rxjs';

@Component({
  selector: 'widget',
  imports: [MatIconModule, CommonModule, MatButtonModule],
  templateUrl: './widget.html',
  styleUrl: './widget.scss'
})
export class Widget {
  title = input();
  description = input();
  collapsed = model(false); //ensure two way binding
  closed= output<void>();// EventEmitter for closed event

  protected btnText= computed(() => this.collapsed() ? 'More Info' : 'Less Info');

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
