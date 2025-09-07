import {Component, inject, input, InputSignal, model, ModelSignal, signal, WritableSignal} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from '@angular/material/icon';
import {ItemPresentation} from './item-presentation/item-presentation';
import {MatDivider} from '@angular/material/divider';
import {ReactiveFormsModule} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {DialogItemsData, DialogSelectItems} from '../dialog-select-items/dialog-select-items.component';
import {IdType} from '../../service/base-service';
import {DialogItemData, DialogSelectItem} from '../dialog-select-item/dialog-select-item';
import {ComponentType} from '@angular/cdk/portal';

@Component({
  selector: 'app-item-selection-list',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    ItemPresentation,
    MatButton,
    ReactiveFormsModule
  ],
  templateUrl: './item-selection-list.component.html',
  styleUrl: './item-selection-list.component.scss'
})
export class ItemSelectionList<T extends { id: IdType, name: string }> {
  public readonly possibleItems: InputSignal<T[]> = input.required();
  public readonly selectionItem: ModelSignal<T[] | T | undefined> = model.required();
  public readonly itemName: InputSignal<string> = input.required();
  public readonly selectionDirty: ModelSignal<boolean> = model(false);
  private readonly dialog: MatDialog = inject(MatDialog);

  protected select(): void {
    const item: T[] | T | undefined = this.selectionItem();
    let data: DialogItemData<T> | DialogItemsData<T>;
    let dialogComponent: ComponentType<DialogSelectItem<T> | DialogSelectItems<T>>;

    if(Array.isArray(item)) {
      data = {
        possibleItems: this.possibleItems(),
        selectedItems: item,
        itemName: this.itemName()
      };
      dialogComponent = DialogSelectItems;
    }
    else {
      data = {
        possibleItems: this.possibleItems(),
        itemName: this.itemName()
      }
      dialogComponent = DialogSelectItem;
    }

    const dialogRef = this.dialog.open(dialogComponent, {
      data: data
    });

    dialogRef.afterClosed().subscribe((result: T[] | T | undefined) => {
      this.selectionDirty.set(true);
      if(!result) {
        return;
      }

      this.selectionItem.set(result);
    });
  }

  protected deleteItem(idx: number | undefined): void {
    let current: T[] | T | undefined = this.selectionItem();

    if(current === undefined){
      return;
    }
    else if(Array.isArray(current) && idx !== undefined){
      current.splice(idx, 1);
      this.selectionItem.set(current);
    }
    else{
      this.selectionItem.set(undefined);
    }
  }

  protected readonly Array = Array;
}
