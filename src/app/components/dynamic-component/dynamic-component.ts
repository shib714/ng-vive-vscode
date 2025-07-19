import { style } from "@angular/animations";
import { Component, ComponentRef, effect, inputBinding, outputBinding, signal, twoWayBinding, viewChild, ViewContainerRef } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltip } from "@angular/material/tooltip";
import { HoverEffectDirective } from "./hover-effect.directive";
import { Widget } from "./widget/widget";

@Component({
    selector: 'dynamic-component',
    standalone: true,
    imports: [MatButtonModule],
    templateUrl: './dynamic-component.html',
    styleUrl: './dynamic-component.scss'
})
export class DynamicComponent {

    vcr = viewChild('container', { read: ViewContainerRef });
    compactMode = signal(false);
    #componentRef?: ComponentRef<Widget>;

    constructor() {
        effect(() => {
            const isCompactMode = this.compactMode();
            this.#componentRef?.setInput('collapsed', isCompactMode)
        })
    }

    createComponent() {
        this.vcr()?.clear();  
        //whenever user clicks the  'Create Component' button, we dynamically create the Widget component     
        this.#componentRef = this.vcr()?.createComponent(Widget);

        //once the Widget component is created, we set the required inputes 
        this.#componentRef?.setInput('title', 'Weather Condition');
        this.#componentRef?.setInput('description', 'Current weather conditions in your area.');
        this.#componentRef?.setInput('collapsed', this.compactMode());

        //and subscribe to the closed outputes
        this.#componentRef?.instance.collapsed
            .subscribe((isCollapsed) => {
                this.compactMode.set(isCollapsed);            
         });

         //once it emits, we destroy the component
        this.#componentRef?.instance.closed.subscribe(
        () => { this.#componentRef?.destroy();
            this.#componentRef = undefined;
        });   
        console.log('Widget Component Created...');

    }
    
}