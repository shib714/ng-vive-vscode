import { style } from "@angular/animations";
import { Component, ComponentRef, inputBinding, outputBinding, signal, twoWayBinding, viewChild, ViewContainerRef } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltip } from "@angular/material/tooltip";
import { HoverEffectDirective } from "./hover-effect.directive";
import { Widget } from "./widget/widget";

@Component({
    selector: 'dynamic-component',
    standalone: true,
    imports: [MatButtonModule],
    template: `
    <main id="content">
        <h1>Creating Dynamic Component in Angular 20</h1> 
        <ng-container #container></ng-container>
        <section class="toolbar ">  
            <p>Click the button to create the weather component dynamically.</p>
            <button mat-flat-button (click)="createComponent()">Create Component</button>
        </section>
    </main>`,
    styles: `
        main {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
        }
        .toolbar {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 1rem;
        }
    `
})
export class DynamicComponent {
     vcr = viewChild('container', { read: ViewContainerRef });
    compactMode = signal(false);
    #componentRef?: ComponentRef<Widget>;

    constructor() {
        // effect  (() => {
        //     const isComppactMode = this.compactMode();
        //     console.log(`Compact Mode is ${isComppactMode ? 'ON' : 'OFF'}`);
        //     this.#componentRef?.setInput('collapsed', isComppactMode);
        // });
        // console.log('Dynamic App Component Created');
    }

    createComponent() {
        this.vcr()?.clear();
        //Modifications with Angular 20 bindings features
        this.#componentRef = this.vcr()?.createComponent(
            Widget, {
            bindings: [
                // Using inputBinding to bind inputs to the component
                inputBinding('title', () => 'Weather Condition'),
                inputBinding('description', () => 'Current weather conditions in your area.'),
                // inputBinding('collapsed', () => this.compactMode), 

                // This is a two-way binding, so it will update the signal when the input changes;
                // meaning the effect above will be triggered. So we can remove the effect for 'collapsed' input.

                //Output binding to listen to the collapse event
                //we change 'collapsed' to 'collapsedChange' to avoid runtime error as:
                // "WidgetComponent does not have an output with a public name of "collapsed".
                // outputBinding<boolean>('collapsedChange', (isCollapsed) => {
                //     this.compactMode.set(isCollapsed);
                //     console.log(`Compact Mode is ${isCollapsed ? 'ON' : 'OFF'}`);
                // }),

                /**the above input/output binding of 'collapsed' which is model() can be replaced as twoWayBinding as blow */
                twoWayBinding('collapsed', this.compactMode), // This is a two-way binding, so it will update the signal when the input changes;



                //Output binding to listen to the closed event
                outputBinding('closed', () => {
                    this.#componentRef?.destroy();
                    this.#componentRef = undefined; // Clear the reference to the component to avoid memory leaks and let gc to collect it.
                    console.log('Widget Component Destroyed');
                }),
            ],
            //introducing a directive 
            directives: [
                HoverEffectDirective,
                {
                    type: MatTooltip,
                    bindings: [
                        inputBinding('matTooltip', () => 'Subscribe to get weather updates!'),
                        inputBinding('matTooltipPosition', () => 'above'),
                        inputBinding('matTooltipDisabled', () => this.compactMode()), // Disable tooltip in
                    ]
                }
            ]
        }
        );
        /** 
         * The above bindings is same as below two 'title' and 'description' setInput; so we 
         * can comment them. 
         * 
         * However, once we use inputBinding, we can't use setInput any more as we did in 'collapsed'; it will cause run time error as:
         * "Cannot call `setInput` on a component that is using the `inputBinding` or `twoWayBinding` functions".
         * So, we can use either inputBinding or setInput, not both.
         * 
         */

        //this.#componentRef?.setInput('title', 'Weather Condition');
        //this.#componentRef?.setInput('description', 'Current weather conditions in your area.');
        //this.#componentRef?.setInput('collapsed', this.compactMode());

        //with the outputBinding code above, we can remove these collapsed and close handleing code
        // this.#componentRef?.instance.collapsed.subscribe((isCollapsed) => {
        //     this.compactMode.set(isCollapsed);            
        // });

        // this.#componentRef?.instance.closed.subscribe(() => {
        //     this.#componentRef?.destroy();
        //     this.#componentRef = undefined;
        // });   
        console.log('Widget Component Created');

    }
    
}