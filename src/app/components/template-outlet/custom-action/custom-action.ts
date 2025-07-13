
import { Component, inject } from "@angular/core";
import { WeatherWidget } from "../widgets/weather-widget/weather-widget";
import { MatButtonModule } from "@angular/material/button";


@Component({
    selector: 'custom-action',
    imports: [MatButtonModule],
    template: `
        <button mat-flat-button color="accent" (click)="onClick()">Reload & Copy</button>   
    `,
    styles: ``
   
})
export class CustomAction {

    WeatherWidget = inject(WeatherWidget);
    
    onClick() {
        console.log('Custom action clicked');
        this.WeatherWidget.actions.reload();
        this.WeatherWidget.actions.copyData();
    }
}