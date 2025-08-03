import { CommonModule } from '@angular/common';
import { Component, input, model, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { WeatherContent } from './weather-content';

@Component({
  selector: 'dc-widget',
  imports: [CommonModule, MatButtonModule, WeatherContent],
  templateUrl: './widget.html',
  styleUrl: './widget.scss'
})
export class Widget {

  title = input<string>("_Widget Title_");
  description = input<string>("_Widget Description_");
  closed = output<void>();
  collapsed = model(false);

  toggleCompactMode() {
    this.collapsed.set(!this.collapsed());
    console.log('Compact mode toggled:', this.collapsed());

  }
}
