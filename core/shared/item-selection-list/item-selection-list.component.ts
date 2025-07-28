import {Component, inject, input, InputSignal, model, ModelSignal, signal, WritableSignal} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from '@angular/material/icon';
import {ItemPresentation} from './item-presentation/item-presentation';
import {MatDivider} from '@angular/material/divider';
import {ReactiveFormsModule} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {DialogData, DialogSelectItems} from '../dialog-select-items/dialog-select-items.component';

@Component({
  selector: 'app-item-selection-list',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    ItemPresentation,
    MatButton,
    MatDivider,
    ReactiveFormsModule
  ],
  templateUrl: './item-selection-list.component.html',
  styleUrl: './item-selection-list.component.scss'
})
export class ItemSelectionList<T extends { id: number, name: string }> {
  public readonly possibleItems: InputSignal<T[]> = input.required();
  public readonly items: ModelSignal<T[]> = model.required();
  private readonly dialog: MatDialog = inject(MatDialog);

  protected updateItems(): void {
    const data: DialogData<T> = {
      possibleItems: this.possibleItems(),
      selectedItems: this.items()
    };

    const dialogRef = this.dialog.open(DialogSelectItems<T>, {
      data: data
    });

    dialogRef.afterClosed().subscribe((result: T[] | undefined) => {
      if(!result) {
        return;
      }

      this.items.set(result);
    });
  }

  protected deleteItem(itemId: number): void {
    let current: T[] = this.items();
    current.splice(itemId, 1)
    this.items.set(current);
  }
}
