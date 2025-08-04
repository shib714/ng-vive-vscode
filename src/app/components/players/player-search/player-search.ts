import { ChangeDetectorRef, Component, computed, DestroyRef, effect, ElementRef, signal, Signal, viewChild, viewChildren } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { players } from '../model/players';
import { PlayerComponent } from '../player.component';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'player-search',
   imports: [CommonModule, PlayerComponent, FormsModule, CdkScrollable, ReactiveFormsModule],
  templateUrl: './player-search.html',
  styleUrl: './player-search.scss'
})
export class PlayerSearch {
   protected players = players;
  protected searchText = signal('');
  protected search = new FormControl<string>('');
  protected filteredPlayers = computed(() => this.players.filter(p => p.name.toLowerCase().includes(this.searchText().toLowerCase())));
  //protected playerComponentsCount: number = 0;

  //Step 1 : Let’s switch this @ViewChild to use signals
  //We will use new effect function within the constructor instead of ngAfterViewInit lifecycle hook, 
  // allowing us to react to signal value changes
  //@ViewChild('searchField') private searchField?: ElementRef<HTMLInputElement>; --old way
  private searchField = viewChild<ElementRef<HTMLInputElement>>('searchField'); //new way

  //Step 2: 
  //@ViewChildren(PlayerComponent) private playerComponents?: QueryList<PlayerComponent>;
  private playerComponents = viewChildren(PlayerComponent);
  //With this conversion, rather than use the function (updatePlayerComponentsCount) with the whole observable subscription, 
  // we create playerComponentsCount a signal from another signal using the new computed function .
  //So, whenever the viewChildren signal is updated, its value will trigger this signal to update with its new length

  //This means we can remove all the “updatePlayerComponentsCount” function, 
  // the ngAfterViewInit function and its imports, the takeUntilDestroyed function, the DestroyRef, and the ChangeDetectorRef too
  protected playerComponentsCount: Signal<number> = computed(() => this.playerComponents().length);

  constructor(private destroyRef: DestroyRef, private changeDetectorRef: ChangeDetectorRef) {
    //with this change, we’d see that the search field gets focused when initialized just like we want
    //note, this change doesn't update the playerComponentsCount, as it's not a signal
    //we will need to convert it to a signal to update the playerComponentsCount
    effect(() => {
      this.searchField()?.nativeElement.focus();
  });
}

}
