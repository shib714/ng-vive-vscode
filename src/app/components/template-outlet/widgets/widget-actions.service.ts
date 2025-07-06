import { Injectable, inject } from "@angular/core";
import { WidgetState, WeatherData } from "./widget-state.service";


@Injectable()
export class WidgetActions {

    state = inject(WidgetState);

   reload() {
    this.state.lastUpdatedAt = new Date();
    console.log('Reloading widget data');
   }

   copyData() {
    console.log('Copying widget data');
   }
}