import { Component, ComponentRef, inject, signal, TemplateRef, viewChild, ViewContainerRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Widget } from './widget/widget';


@Component({
  selector: 'dynamic-component-part-1',
  imports: [MatButtonModule],
  templateUrl: './dynamic-component.html',
  styleUrl: './dynamic-component.scss'
})
//https://www.youtube.com/watch?v=ncbftt3NWVo
//Demonstrate how to dynamically create and destroy components
//How to update component inputs 
//How to react to the component outputs
//How to project content in dynamically created component
//all using modern signal based API
export class DynamicComponent {

   compactMode = signal(false);

  createComponent() {

  }
  destroyComponent() {

  }
  
  toggleCompactMode() {
    this.compactMode.set(!this.compactMode());
    console.log('Compact mode toggled:', this.compactMode());
  }

}
