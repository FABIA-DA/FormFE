import {Component, computed, inject, Signal, signal, WritableSignal} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardTitle} from '@angular/material/card';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatInputModule, MatLabel} from '@angular/material/input';
import {MatDivider} from '@angular/material/divider';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {FormField, OneOfField} from '../../../core/module';
import {DialogSelectFormField} from '../../../core/shared/dialog-select-form-field/dialog-select-form-field';
import {SnackbarService} from '../../../core/service/snackbar-service';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-add-one-of-form-field',
  standalone: true,
  imports: [
    MatCardTitle,
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInputModule,
    MatDivider,
    MatButton,
    MatIcon,
    MatIconButton,
    MatCardActions,
  ],
  templateUrl: './add-one-of-form-field.html',
  styleUrl: './add-one-of-form-field.scss'
})
export class AddOneOfFormField {
  private readonly snackbar: SnackbarService = inject(SnackbarService);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  protected readonly oneOfFieldForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    options: this.formBuilder.array([
      this.createOption(),
      this.createOption()
    ])
  });
  protected readonly fields: WritableSignal<FormField[]>[] = [
    signal([]),
    signal([])
  ];
  private readonly change: Signal<any> = toSignal(this.oneOfFieldForm.valueChanges);
  protected readonly isValid: Signal<boolean> = computed(() => {
    this.change();
    return this.oneOfFieldForm.valid;
  });

  private createOption(): FormControl {
      return this.formBuilder.control('', Validators.required);
  }

  protected get options(): FormArray {
    return this.oneOfFieldForm.get('options') as FormArray;
  }

  protected addOption(): void {
    this.options.push(
      this.createOption()
    );
    this.fields.push(signal([]));
  }

  protected addField(id: number): void {
    const option = this.options.at(id) as FormGroup;
    if(!option){
      return;
    }

    const fieldsOfOption = this.fields.at(id);
    if(!fieldsOfOption){
      return;
    }

    const dialogData: AlreadySelectedFields = {
      fields: fieldsOfOption()
    };

    const dialogRef = this.dialog.open(DialogSelectFormField, {
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((result: FormField[]) => {
      if(!result){
        return;
      }

      const current: FormField[] = fieldsOfOption();
      const newFields: FormField[] = result.filter(f => !current.includes(f));
      fieldsOfOption.set(newFields);
    });
  }

  protected deleteOption(id: number): void {
    for(let i = id; i < this.options.length -1; i++){
      this.options.at(i).setValue(this.options.at(i + 1).value);
    }

    this.options.removeAt(id);

    this.fields.splice(id, 1);
  }

  protected deleteField(id: number, fieldId: number): void {
    const fieldsOfOption = this.fields.at(id);
    if(!fieldsOfOption){
      return;
    }

    let updatedFields: FormField[] = fieldsOfOption();
    updatedFields.splice(fieldId, 1);
    fieldsOfOption.set(updatedFields);
  }

  protected async submitFormField(): Promise<void> {
    if(!this.isValid()){
      return;
    }

    const name: string | undefined = this.oneOfFieldForm.get('name')?.value;
    const options: Array<string | undefined> = this.oneOfFieldForm.get('options')?.value;

    if(name === undefined
    || options.some(o => o === undefined))
    {
      this.snackbar.show('The form is still invalid');
      return;
    }

    let map: Map<string, FormField[]> = new Map();

    for(let i = 0; i < this.options.length && i < this.fields.length; i++){
      map.set(options.at(i)!, this.fields[i]());
    }

    let oneOfFormField: OneOfField = {
      name: name,
      optionsMap: map
    }

    //TODO submit one-of-form-field
    this.snackbar.show('The field was submitted successfully');
    this.oneOfFieldForm.reset();
  }

  protected readonly Array = Array;
}

export type AlreadySelectedFields = {
  fields: FormField[];
}
