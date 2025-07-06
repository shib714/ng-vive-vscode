import { Component, inject, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";
import { WidgetActions } from "../widget-actions.service";
import { WidgetState } from "../widget-state.service";
import { MatButtonModule } from "@angular/material/button";


@Component({
    selector: 'weather-widget',
    imports: [MatButtonModule],
    template: `
    <div class="widget">
        <div class="widget-header">
            <!-- First attempt to use ng-template; we defined two template variables: defaultHeader & container, 
             get their reference in the ts file using @ViewChild decorator and use ngAfterViewInit lifecycle hook to set the template to the container-->
            <div #container></div>
            <ng-template #defaultHeader>
                <div class="widget-title">Weather Widget</div>
                <div class="widget-sub-title">Current Weather in Ottawa, ON</div>
            </ng-template>
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

    // we get the references of the template reference variables using @ViewChild decorators as below
    @ViewChild('container', {read: ViewContainerRef }) container!: ViewContainerRef;
    @ViewChild('defaultHeader', {read: TemplateRef<any> }) headerTemplate!: TemplateRef<any>;

    // using ngAfterViewInit lifecycle hook, we created a new embedded view of the header template  inside the container
    ngAfterViewInit() {
        this.container.createEmbeddedView(this.headerTemplate);
    }
}