import { Component } from "@angular/core";
import { WeatherWidget } from "./widgets/weather-widget/weather-widget";

@Component({
    selector: 'app-weather-template-outlet',
    template: `
    <div class="weather-container">
        <h2>NG Template Outlet demo: Weather Widget</h2>

        <weather-widget [headerTemplate]="userAltHeader">
        <ng-template #userAltHeader>
                <div class="widget-title">Today's Weather</div>
                <div class="widget-sub-title">Current Weather in Ottawa, ON</div>
            </ng-template>

        </weather-widget>
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
       
        `
    ],
    imports: [WeatherWidget]
})
export class WeatherApp {

}