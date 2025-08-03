import { CommonModule } from '@angular/common';
import { Component, computed, input, model, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WeatherContent } from '../../content-projection/weather-content/weather-content';

@Component({
  selector: 'widget',
  imports: [MatIconModule, CommonModule, MatButtonModule, WeatherContent],
  templateUrl: './widget.html',
  styleUrl: './widget.scss'
})
export class Widget {
  title = input();
  description = input();
  collapsed = model(false); //ensure two way binding
  closed = output<void>();// EventEmitter for closed event

  protected btnText = computed(() => this.collapsed() ? 'More Info' : 'Less Info'); 

  ngOnDestroy() {
    console.log('Weather Content Is Destroyed...');
  }


}
