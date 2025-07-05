import { CommonModule } from "@angular/common";
import { Component, ContentChild, Input, TemplateRef } from "@angular/core";


@Component({
    selector: 'custom-table',
    imports: [CommonModule],
    templateUrl: './custom-table.html',
    styleUrl: './custom-table.scss'

})
export class CustomTable {
    
  @Input() data!: any[];
  @ContentChild('headers') headers: TemplateRef<any> | undefined;
  @ContentChild('rows') rows: TemplateRef<any> | undefined;
    
}