import { Component, Input } from '@angular/core';
import { Player } from '../model/players';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-player-details',
  imports: [CommonModule],
  templateUrl: './player-details.html',
  styleUrl: './player-details.scss'
})
export class PlayerDetails {
   @Input({required: true}) player!: Player;

}
