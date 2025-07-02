import { Component, contentChild, signal, TemplateRef } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { NgTemplateOutlet } from "@angular/common";
import { Button } from "../button/button";


@Component({
    selector: 'app-widget',
    standalone: true,
    imports: [MatButtonModule, NgTemplateOutlet, Button,], 
    templateUrl: './widget.html',
    styleUrls: ['./widget.scss'],
})

export class Widget { 
    hidden = signal<boolean>(false);
    content = contentChild<TemplateRef<unknown>>('widgetContent');
    //content = contentChild(WidgetContentDirective);
}