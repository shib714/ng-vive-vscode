import { Component } from "@angular/core";

@Component({
    selector: 'app-button',
    imports: [],    
    template: `
        <button  (click)="refresh()">
            <ng-content></ng-content> 
            <span class="button-icon">
                <ng-content select="[slot='icon']"></ng-content>    
            </span>
         </button>`,
    styles: `
     .button-icon {
            background:teal;
            border: #666 dashed 1px;
            border-radius: 5px;
            min-width: 25px;
            min-height: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            //margin: 4px;
        }`,
})
export class Button {
    refresh() {
        console.log('Button clicked');
    }
}
