import { Component } from "@angular/core";
import { WeatherWidget } from "./widgets/weather-widget/weather-widget";
import { CustomAction } from "./custom-action/custom-action";

@Component({
    selector: 'app-weather-template-outlet',
    imports: [ CustomAction, WeatherWidget],
    template: `
    <div class="weather-container">
        <h2>NG Template Outlet demo: Weather Widget</h2>

        <weather-widget 
            [headerTemplate]="userAltHeader" 
            [contentTemplate]="userAltContent"
            [actionsTemplate]="userAltActions"></weather-widget>
            
        <ng-template #userAltHeader>
                <div class="alt-header-title">Today's Weather</div>
                <div class="alt-header-sub-title">Current Weather in Ottawa, ON</div>
        </ng-template>

        <ng-template #userAltContent let-state>
                <div class="alt-content-value">Temperature: {{ state.data.tepterature }}°C</div>
                <div class="alt-content-value">Sky condition: {{ state.data.skyCondition === 'sunny' ?  '☀️' : '☁️' }}</div> 
                <div class="alt-content-value">Wind speed: {{ state.data.windspeed }} km/h</div>
        </ng-template>

        <ng-template #userAltActions>
                <custom-action></custom-action>
        </ng-template>
    </div>
    
        `,
    styles: [
        `
        .weather-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

        }
        .alt-header-title {
            font-size: 1.5rem;
            font-weight: 500;
            color: var(--mat-sys-primary);
        }
        .alt-header-sub-title {
            font-size: 1rem;
            color: var(--mat-sys-primary);
        }
       
        `
    ],

})
export class WeatherApp {

}