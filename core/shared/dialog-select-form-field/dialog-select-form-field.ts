import {Component, inject, model, ModelSignal} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import {FormField} from '../../module';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatListOption, MatSelectionList} from '@angular/material/list';
import {AlreadySelectedFields} from '../../../src/app/add-one-of-form-field/add-one-of-form-field';

@Component({
  selector: 'app-dialog-select-form-field',
  standalone: true,
  imports: [
    MatDialogModule,
    FormsModule,
    MatButton,
    MatSelectionList,
    MatListOption
  ],
  templateUrl: './dialog-select-form-field.html',
  styleUrl: './dialog-select-form-field.scss'
})
export class DialogSelectFormField {
  protected readonly fields: FormField[] = [
    {
      id: 0,
      name: 'Email',
      description: '',
      isOptional: false,
      type: 'email'
    },
    {
      id: 1,
      name: 'Tele',
      description: '',
      isOptional: false,
      type: 'tele'
    },
    {
      id: 2,
      name: 'Sirname',
      description: '',
      isOptional: false,
      type: 'text'
    },
    {
      id: 3,
      name: 'Title',
      description: '',
      isOptional: false,
      type: 'text'
    },
  ];
  private readonly data = inject<AlreadySelectedFields>(MAT_DIALOG_DATA);
  protected readonly selectedFields: ModelSignal<FormField[]> = model<FormField[]>(this.data.fields);

  protected compareFields(a: FormField, b: FormField): boolean {
    return a.id === b.id;
  }
}
