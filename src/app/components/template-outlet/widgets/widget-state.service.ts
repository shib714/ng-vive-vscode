import { Injectable } from "@angular/core";


export interface WeatherData {
    tepterature: number;
    windspeed: number;
   skyCondition: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
}

@Injectable()
export class WidgetState {

    data: WeatherData = {
        tepterature: 21,
        windspeed: 10,
        skyCondition: 'sunny'
    }

    updateData(data: WeatherData) {
        this.data = data;
    }

    lastUpdatedAt: Date = new Date();
}