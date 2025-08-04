import { Component, ComponentRef, signal, TemplateRef, viewChild, ViewContainerRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Widget } from './widget/widget';
import { WeatherContent } from './widget/weather-content';


@Component({
  selector: 'dynamic-component-part-1',
  imports: [MatButtonModule, WeatherContent],
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

  //private viewContainerRef = inject(ViewContainerRef);
  vcr = viewChild('dynamicContainer', { read: ViewContainerRef });

  //to set the title, description, and other metadata for the component
  #componentRef?: ComponentRef<Widget>;
  weatherContent = viewChild<TemplateRef<unknown>>('weatherContent');

  createComponent() {
    this.vcr()?.clear();// Clear any existing component before creating a new one
    console.log('Creating component');
    const content = this.vcr()?.createEmbeddedView(this.weatherContent()!);

    this.#componentRef = this.vcr()?.createComponent(Widget, {
      projectableNodes: [
        content?.rootNodes!
      ]
    });
    //handle the inputs for the dynamically created component
    this.#componentRef?.setInput('title', 'Weather Condition');
    this.#componentRef?.setInput('description', 'Currently in Ottawa, Ontario.');

    //handle the output event from the dynamically created component
    this.#componentRef?.instance.closed.subscribe(() => {
      console.log('Component closed');
      this.#componentRef?.destroy(); // Destroy the component when the closed event is emitted
    })

  }
  destroyComponent() {
    console.log('Destroying component');
    this.vcr()?.clear();
  }

}
