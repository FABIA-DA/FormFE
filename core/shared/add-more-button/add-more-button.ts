import {Component, output, OutputEmitterRef} from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-add-more-button',
  standalone: true,
  imports: [
    MatIconButton,
    MatIcon
  ],
  templateUrl: './add-more-button.html',
  styleUrl: './add-more-button.scss'
})
export class AddMoreButton {
  public readonly onClick: OutputEmitterRef<void> = output<void>();

  protected emitClick(): void {
    this.onClick.emit();
  }
}
