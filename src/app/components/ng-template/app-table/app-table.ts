import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CustomTable } from '../custom-table/custom-table';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-table',
  imports: [CommonModule, CustomTable, MatButtonModule],
  template: `
  <div class="app-content">
    <h2>Usage of ng-template demo</h2>
    <!-- No templates provided, will use default layout -->
    <custom-table [data]="employees"></custom-table>

    <!-- Basic configured template -->
    <custom-table [data]="employees">
      <ng-template #headers>
        <th>First</th>
        <th>Last</th>
      </ng-template>
    </custom-table>

    <!-- Highly configured template with conditional elements -->
    <custom-table [data]="inventory">
      <ng-template #headers>
        <th>Item</th>
        <th>Price</th>
        <th></th>
        <th></th>
      </ng-template>
      <ng-template #rows let-row>
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
      </ng-template>
    </custom-table>
  </div>
  `,
})



export class AppTable {
  employees = [
    { firstName: 'Employee', lastName: 'One' },
    { firstName: 'Employee', lastName: 'Two' },
    { firstName: 'Employee', lastName: 'Three' },
    { firstName: 'Employee', lastName: 'Four' },
    { firstName: 'Employee', lastName: 'Five' },
  ];

  inventory = [
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