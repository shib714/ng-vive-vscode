import { Component } from "@angular/core";
import { Widget } from "../widget/widget";
import { WeatherContent } from "../weather-content/weather-content";


@Component({
    selector: 'app-weather',
    standalone: true,
    imports: [Widget, WeatherContent],
    template: `
    <div>
        <h1>Content ProjectionDemo: Weather App</h1>
        <app-widget>  
            <ng-container ngProjectAs="[slot='header']" >      
                <div class="widget-title">Weather Forecast</div>
                <div class="widget-sub-title">Currently in Ottawa, Ontario</div>    
            </ng-container> 
            <!-- <div class="sky-condition">Sky Condition: ☀️</div>
            <div class="temperature">Temperature: 21°C</div> 
            instead of html, we can use a component 
                <weather-content></weather-content>
            -->
             <weather-content></weather-content>
        </app-widget>
    </div>
    `,
    styleUrls: ['./weather-app.scss'],
})


export class WeatherApp {}