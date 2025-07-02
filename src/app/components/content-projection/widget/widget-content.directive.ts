import { Directive, inject, TemplateRef } from "@angular/core";


@Directive({
    selector: '[appWidgetContentDirective]',

})
export class WidgetContentDirective {
    // This directive serves as a marker for content projection.
    // It can be used to project content into the widget component.
    templateRef = inject(TemplateRef);
}