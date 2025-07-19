import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CustomTable, TableHeaderTemplateDirective, TableRowTemplateDirective } from '../custom-table/custom-table';
import { MatButtonModule } from '@angular/material/button';


@Component({
  standalone: true,
  selector: 'app-table',
  imports: [CommonModule, CustomTable, MatButtonModule, TableHeaderTemplateDirective, TableRowTemplateDirective],
  template: `
  <div class="app-content">
    <h2>Usage of ng-template demo</h2>
    <!-- No templates provided, will use default layout -->
     <custom-table [data]="inventory"></custom-table> 

    <!-- Basic configured template -->
     <custom-table [data]="employees">
      <ng-container *tableHeader>
        <th>First</th>
        <th>Last</th>
      </ng-container>
    </custom-table> 

    <!-- Highly configured template with conditional elements -->
    <custom-table [data]="inventory">
      <ng-container *tableHeader>
        <th>Item</th>
        <th>Price</th>
        <th>Buy</th>
        <th>Delete</th>
      </ng-container>
      <ng-container *tableRow="inventory; let row">
        <td>{{ row.name }}</td>
        <td>{{ row.price | currency: row.currency }}</td>
        <td>
          @if (row.inStock) {
            <button mat-flat-button   (click)="purchaseItem(row.plu)">
            Buy now
          </button>
        }          
        </td>
        <td>
          <button mat-flat-button class="warn">Delete</button>
        </td>
      </ng-container>
    </custom-table>
  </div>
  `,
})



export class AppTable {
  employees = [
    { firstName: 'John', lastName: 'Sutter' },
    { firstName: 'Emaily', lastName: 'Chao' },
    { firstName: 'Steven', lastName: 'Simon' },
    { firstName: 'Jessica', lastName: 'Thompson' },
    { firstName: 'Erica', lastName: 'Dorvolt' },
  ];

  inventory:Inventory[] = [
    {
      plu: 110,
      supplier: 'X Corp',
      name: 'Table extender',
      inStock: 500,
      price: 50,
      currency: 'GBP',
    },
    {
      plu: 120,
      supplier: 'X Corp',
      name: 'Heated toilet seat',
      inStock: 0,
      price: 80,
      currency: 'GBP',
    },
    {
      plu: 155,
      supplier: 'Y Corp',
      name: 'Really good pencil',
      inStock: 1,
      price: 8000,
      currency: 'AUD',
    },
  ];

  purchaseItem(plu: number) {
    console.log('handle purchase for', plu);
  }
}

export interface Employee {
  firstName: string;
  lastName: string;
}

export interface Inventory {
  plu: number;
  supplier: string;
  name: string;
  inStock: number;
  price : number;
  currency: string;
}