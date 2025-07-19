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
    //     effect(() => {
    //         const isCompactMode = this.compactMode();
    //         this.#componentRef?.setInput('collapsed', isCompactMode)
    //     })
    }

    createComponent() {
        this.vcr()?.clear();  
        //whenever user clicks the  'Create Component' button, we dynamically create the Widget component 
        
        //REFACTORING Start
        
        //Few disadvantages of this code:
        //a. This code isn't reactive; it is imperative and it would be nice to have something more declerative and reactive
        //b. Handling of two-way data binding is very cumbersome
        //c. There is no unified style to work with dynamic component inputs and outputs
        //d. The current output API requires us to access the class output property 
        //   directly which doesn't respect their output aliasing and it is different from how it works in component templates.

        //In Angular 20, we got a new property called 'bindingd' in the create component config, where we can difine input, output, and two-way bindingd.
        //For example, to create an input binding,  we can use a function called input binding (imported from Angular Core.)
        // this.#componentRef = this.vcr()?.createComponent(Widget); -old version

        //input binding also tracks changes inside the compact mode signal and reactively update the value of the collapsed input; 
        // so we can remove the effect () inside the constructor.

        //This changes concludes input binding migration without breaking anything.
        this.#componentRef = this.vcr()?.createComponent(Widget, {
            bindings: [
                inputBinding('title', () => 'Weather Condition'),
                inputBinding('description', () => "Today's weather conditions in Ottawa."),
                inputBinding('collapsed', this.compactMode)
            ]
        }); 

        //once the Widget component is created, we set the required inputes 

        //With the above change, we can remove/commented the below two lines
        //this.#componentRef?.setInput('title', 'Weather Condition'); 
        //this.#componentRef?.setInput('description', 'Current weather conditions in your area.');
        //this.#componentRef?.setInput('collapsed', this.compactMode());

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