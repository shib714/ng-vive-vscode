import { Component, inject, Injector, input, Input, TemplateRef } from "@angular/core";
import { WidgetActions } from "../widget-actions.service";
import { WidgetState } from "../widget-state.service";
import { MatButtonModule } from "@angular/material/button";
import { NgTemplateOutlet } from "@angular/common";


@Component({
    selector: 'weather-widget',
    imports: [MatButtonModule, NgTemplateOutlet],
    template: `
    <div class="widget">
        <div class="widget-header">
            <!-- using ngTemplateOutlet directive instead of declarative approach as we did in the previous commit 
             Note: we didn't use any @ViewChild decorator in the ts file in this approach
             
             Advantages are: we can dynamically provide any template we want or ask the consumer to provide one
             For example, if we use @Input() decorator in the ts file, let's say @Input() headerTemplate!: TemplateRef<any> as below;
                then we can change the template dynamically in the html file as below-->
            <ng-container [ngTemplateOutlet]="headerTemplate() || defaultHeader"></ng-container>
            <ng-template #defaultHeader>
                <div class="widget-title">Weather Forecast</div>
                <div class="widget-sub-title">Current Weather in Ottawa, ON</div>
            </ng-template>
        </div>
        <div class="widget-content">  
                <ng-container [ngTemplateOutlet]="contentTemplate() || defaultContent" 
                        [ngTemplateOutletContext]="{ $implicit: state }"></ng-container>
                <ng-template #defaultContent>
                    <div class="content-value">Temperature: {{ state.data.tepterature }}°C</div>
                    <div class="content-value">Sky condition: {{ state.data.skyCondition === 'sunny' ?  '☀️' : '☁️' }}</div>       
                </ng-template>
        </div>
                                
        <div class="widget-actions">
            <ng-container 
                        [ngTemplateOutlet]="actionsTemplate() || defaultActions" 
                        [ngTemplateOutletInjector]="injector"></ng-container>
            <ng-template #defaultActions>
                    <button mat-flat-button color="primary" (click)="actions.reload()">Reload</button>
                    <button mat-flat-button color="primary" (click)="actions.copyData()">Copy Data</button>
            </ng-template>
        </div>
    </div>
    `,
    styleUrl: './weather-widget.scss',
    providers: [WidgetState, WidgetActions]
})
export class WeatherWidget {

    // We use @Input() decorator to enable the consumer to provide a template dynamically
   // @Input() headerTemplate!: TemplateRef<any>;
   headerTemplate = input<TemplateRef<any> | undefined>(undefined);
   contentTemplate = input<TemplateRef<any> | undefined>(undefined);
   actionsTemplate = input<TemplateRef<any> | undefined>(undefined);

    state = inject(WidgetState);
    actions = inject(WidgetActions);
    injector = inject(Injector);
}