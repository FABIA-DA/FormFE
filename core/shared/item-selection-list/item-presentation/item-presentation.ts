import {Component, input, InputSignal} from '@angular/core';

@Component({
  selector: 'app-item-presentation',
  standalone: true,
  imports: [],
  templateUrl: './item-presentation.html',
  styleUrl: './item-presentation.scss'
})
export class ItemPresentation<T extends { name: string }> {
  public readonly item: InputSignal<T> = input.required();
}
