import { Overlay, OverlayModule } from '@angular/cdk/overlay';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, HostBinding, inject, Input } from '@angular/core';


import { PlayerDetails } from './player-details/player-details';
import { Player } from './model/players';

@Component({
  selector: 'app-player',
  imports: [NgOptimizedImage, CommonModule, OverlayModule, PlayerDetails],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent {

  //player = input.required<Player>();
  @Input({ required: true }) player!: Player;
  @HostBinding('@enterLeaveAnimation') animate = true;
  detailsOpen = false;

  overlay = inject(Overlay);
  scrollStrategy = this.overlay.scrollStrategies.reposition();

}
