import { CommonModule } from "@angular/common";
import { Component, ContentChild, Directive, Input, signal, TemplateRef } from "@angular/core";


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
    

sortKey = signal<string | number | null>(null);
sortDirection: 'asc' | 'desc' = 'asc';


get sortedData(): TItem[] {
  if (!this.sortKey) return this.data;
  return [...this.data].sort((a, b) => {
    const aValue = (a as any)[this.sortKey()!];
    const bValue = (b as any)[this.sortKey()!];
    if (aValue == null) return 1;
    if (bValue == null) return -1;
    if (aValue === bValue) return 0;
    if (this.sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
}

onSort(key: string | number | null) {
  if (this.sortKey() === key) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortKey.set(key) ;
    this.sortDirection = 'asc';
  }
}
}