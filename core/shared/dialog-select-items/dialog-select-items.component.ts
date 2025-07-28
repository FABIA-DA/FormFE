import {Component, computed, inject, input, InputSignal, model, ModelSignal, Signal} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatListOption, MatSelectionList} from '@angular/material/list';

@Component({
  selector: 'app-dialog-select-items',
  standalone: true,
  imports: [
    MatDialogModule,
    FormsModule,
    MatButton,
    MatSelectionList,
    MatListOption
  ],
  templateUrl: './dialog-select-items.component.html',
  styleUrl: './dialog-select-items.component.scss'
})
export class DialogSelectItems<T extends { id: number, name: string }> {
  private readonly dialogData: DialogData<T> = inject<DialogData<T>>(MAT_DIALOG_DATA);
  protected readonly possibleItems: Signal<T[]> = computed(() => {
    return this.dialogData.possibleItems;
  })
  protected readonly selectedItems: ModelSignal<T[]> = model<T[]>(this.dialogData.selectedItems);

  protected compareItems(a: T, b: T): boolean {
    return a.id === b.id;
  }
}

export type DialogData<T extends { id: number, name: string }> = {
  possibleItems: T[];
  selectedItems: T[];
}
