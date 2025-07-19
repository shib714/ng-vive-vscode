import { CommonModule } from "@angular/common";
import { Component, ContentChild, Directive, Input, TemplateRef } from "@angular/core";


interface TableHeaderTemplateContext<TItem extends object> {
  $implicit: TItem[];
}

@Directive({
  selector: 'ng-template[tableHeader]'
})
export class TableHeaderTemplateDirective<TItem extends object>{
  @Input('tableHeader') data!: TItem[] | '';

 static ngTemplateContextGuard<TContextItem extends object>(
    dir: TableHeaderTemplateDirective<TContextItem>,
    ctx: unknown
  ): ctx is TableHeaderTemplateContext<TContextItem> {
    return true;
  }
}

interface TableRowTemplateContext<TItem extends object> {
  $implicit: TItem;
}

@Directive({
  selector: 'ng-template[tableRow]'
})
export class TableRowTemplateDirective<TItem extends object>{
  @Input('tableRow') data!: TItem[];

  static ngTemplateContextGuard<TContextItem extends object>(
    dir: TableRowTemplateDirective<TContextItem>,
    ctx: unknown
  ): ctx is TableRowTemplateContext<TContextItem> {
    return true;
  }
}


@Component({
    selector: 'custom-table',
    imports: [CommonModule],
    templateUrl: './custom-table.html',
    styleUrl: './custom-table.scss'

})
export class CustomTable <TItem extends object> {
    
  @Input() data!: TItem[];
  // @ContentChild('headers') headers: TemplateRef<any> | undefined;
  // @ContentChild('rows') rows: TemplateRef<any> | undefined;

  @ContentChild(TableHeaderTemplateDirective, {read: TemplateRef}) headers?: TemplateRef<any>;
  @ContentChild(TableRowTemplateDirective, {read: TemplateRef}) rows?: TemplateRef<any>;
    
}