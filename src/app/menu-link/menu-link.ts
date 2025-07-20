import {Component, input, InputSignal} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {MatMenuItem} from '@angular/material/menu';

@Component({
  selector: 'app-menu-link',
  imports: [
    MatIcon,
    RouterLink,
    MatMenuItem
  ],
  templateUrl: './menu-link.html',
  styleUrl: './menu-link.scss'
})
export class MenuLink {
  public readonly icon: InputSignal<string> = input.required();
  public readonly route: InputSignal<string> = input.required();
}
