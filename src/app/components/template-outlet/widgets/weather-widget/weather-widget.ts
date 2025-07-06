import { Component, inject } from "@angular/core";
import { WidgetActions } from "../widget-actions.service";
import { WidgetState } from "../widget-state.service";
import { MatButtonModule } from "@angular/material/button";


@Component({
    selector: 'weather-widget',
    imports: [MatButtonModule],
    template: `
    <div class="widget">
        <div class="widget-header">
            <div class="widget-title">Weather Widget</div>
            <div class="widget-sub-title">Current Weather in Ottawa, ON</div>            
        </div>
        <div class="widget-content">       
                <div class="content-value">Temperature: {{ state.data.tepterature }}°C</div>
                <div class="content-value">Sky condition: {{ state.data.skyCondition === 'sunny' ?  '☀️' : '☁️' }}</div>       
        </div>
                                
        <div class="widget-actions">
                <button mat-flat-button color="primary" (click)="actions.reload()">Reload</button>
                <button mat-flat-button color="primary" (click)="actions.copyData()">Copy Data</button>
        </div>
    </div>
    `,
    styleUrl: './weather-widget.scss',
    providers: [WidgetState, WidgetActions]
})
export class WeatherWidget {

    state = inject(WidgetState);
    actions = inject(WidgetActions);
}