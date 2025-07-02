import { Component, contentChild, signal, TemplateRef } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { NgTemplateOutlet } from "@angular/common";
import { Button } from "../button/button";
import { WidgetContentDirective } from "./widget-content.directive";


@Component({
    selector: 'app-widget',
    standalone: true,
    imports: [MatButtonModule, NgTemplateOutlet, Button,], 
    templateUrl: './widget.html',
    styleUrls: ['./widget.scss'],
})

export class Widget { 
    hidden = signal<boolean>(false);
    //we get the reference of the template variable widgetContent defined in the widget-app component
    //content = contentChild<TemplateRef<unknown>>('widgetContent');
    
    // Usage of string above is not safe as it is easy to make spelling mistake and compiler will not recognize it. 
    // Better approach would be to use a custom directive which plays the role of selector.
    content = contentChild(WidgetContentDirective);
}