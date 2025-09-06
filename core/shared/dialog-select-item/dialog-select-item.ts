import {Component, computed, inject, signal, Signal, WritableSignal} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import {IdType} from '../../service/base-service';
import {MatListOption, MatSelectionList} from '@angular/material/list';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-dialog-select-item',
  standalone: true,
  imports: [
    MatDialogContent,
    MatSelectionList,
    MatListOption,
    FormsModule,
    MatDialogClose,
    MatButton,
    MatDialogActions,
    MatDialogTitle,
  ],
  templateUrl: './dialog-select-item.html',
  styleUrl: './dialog-select-item.scss'
})
export class DialogSelectItem<T extends { id: IdType, name: string }> {
  private readonly dialogData: DialogItemData<T> = inject<DialogItemData<T>>(MAT_DIALOG_DATA);
  protected readonly possibleItems: Signal<T[]> = computed(() => {
    return this.dialogData.possibleItems;
  });
  protected readonly itemName: Signal<string> = computed(() => {
    return this.dialogData.itemName
  });
  protected readonly selectedItem: WritableSignal<T[] | undefined> = signal(undefined);
}

export type DialogItemData<T extends { id: IdType, name: string }> = {
  possibleItems: T[];
  itemName: string;
}
