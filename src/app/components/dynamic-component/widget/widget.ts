import { CommonModule } from "@angular/common";
import { Component, input, model, output } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { interval } from "rxjs";

@Component({
  selector: 'widget',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './widget.html',
  styleUrls: ['./widget.scss']
})
export class Widget {
  title = input.required<string>();
  description = input.required<string>();

   collapsed = model(false);

 /**
 * collapsed = model(false) is equivalent to 
 * collapsed = input()
 * collapsedChange = output<>();
 * 
 * this.collapsed.set(newValue);
 * this.collapsedChange.emit(newValue);
 * */
  closed = output<void>();

  lastUpdateAt: Date = new Date();

  protected temperature = 21;

  #polling = interval(5000).pipe(takeUntilDestroyed())

  ngOnInit() {
    this.#polling.subscribe(() =>
      this.lastUpdateAt = new Date()
    )
  }

  ngOnDestroy() {
    console.log('Weather Content Is Destroyed...');
  }

  // toggleContent() {
  //   this.collapsed.set(this.collapsed());
  //   this.closed.emit();
  //   console.log('toggledContent:', this.collapsed());
  // }
  toggleCompactMode() {
    this.collapsed.set(!this.collapsed());
    console.log('Compact mode toggled:', this.collapsed());

  }

}