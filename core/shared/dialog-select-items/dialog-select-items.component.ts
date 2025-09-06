import {Component, computed, inject, input, InputSignal, model, ModelSignal, Signal} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatListOption, MatSelectionList} from '@angular/material/list';
import {IdType} from '../../service/base-service';

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
export class DialogSelectItems<T extends { id: IdType, name: string }> {
  private readonly dialogData: DialogItemsData<T> = inject<DialogItemsData<T>>(MAT_DIALOG_DATA);
  protected readonly possibleItems: Signal<T[]> = computed(() => {
    return this.dialogData.possibleItems;
  });
  protected readonly selectedItems: ModelSignal<T[] | undefined> = model<T[] | undefined>(this.dialogData.selectedItems);
  protected readonly itemName: Signal<string> = computed(() => this.dialogData.itemName);

  protected compareItems(a: T, b: T): boolean {
    return a.id === b.id;
  }
}

export type DialogItemsData<T extends { id: IdType, name: string }> = {
  possibleItems: T[];
  selectedItems: T[] | undefined;
  itemName: string;
}
