import { Component, ComponentRef, inputBinding, outputBinding, signal, twoWayBinding, viewChild, ViewContainerRef } from '@angular/core';
import { Widget } from './widget/widget';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'dyna-component',
  imports: [MatButtonModule],
  templateUrl: './dynamic-component.html',
  styleUrl: './dynamic-component.scss'
})
export class DynamicComponent {

  vcr = viewChild('container', { read: ViewContainerRef });
  compactMode = signal(false);
  #componentRef?: ComponentRef<Widget>;



  createComponent() {
    this.vcr()?.clear();

    this.#componentRef = this.vcr()?.createComponent(Widget, {
      bindings: [
        inputBinding('title', () => 'Weather Condition'),
        inputBinding('description', () => "Today's weather conditions in Ottawa."),
        inputBinding('collapsed', this.compactMode),

        twoWayBinding('collapsed', this.compactMode),

        outputBinding('closed', () => {
          this.#componentRef?.destroy();
          this.#componentRef = undefined;

        })
      ],
    });

    console.log('Widget Component Created');
  }

  toggleCompactMode() {
    this.compactMode.set(!this.compactMode());
    console.log('Compact mode toggled:', this.compactMode());

  }

}
