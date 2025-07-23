import {Component, input, InputSignal} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatMenuItem, MatMenuPanel, MatMenuTrigger} from '@angular/material/menu';

@Component({
  selector: 'app-menu-trigger',
  imports: [
    MatIcon,
    MatMenuItem,
    MatMenuTrigger
  ],
  templateUrl: './menu-trigger.component.html',
  styleUrl: './menu-trigger.component.scss'
})
export class MenuTrigger {
  public readonly icon: InputSignal<string> = input.required();
  public readonly menuTriggerFor: InputSignal<MatMenuPanel> = input.required();
}
