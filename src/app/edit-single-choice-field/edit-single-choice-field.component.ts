import {Component, computed, inject, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardTitle} from '@angular/material/card';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatInputModule, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {SnackbarService} from '../../../core/service/snackbar-service';
import {toSignal} from '@angular/core/rxjs-interop';
import {ItemSelectionList} from '../../../core/shared/item-selection-list/item-selection-list.component';
import {AddMoreButton} from '../../../core/shared/add-more-button/add-more-button';
import {Field, FieldService} from '../../../core/service/field-service';
import {SingleChoiceFieldService} from '../../../core/service/single-choice-field-service';
import {IdType} from '../../../core/service/base-service';
import {MatProgressBar} from '@angular/material/progress-bar';

@Component({
  selector: 'app-add-single-choice-field',
  standalone: true,
  imports: [
    MatCardTitle,
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInputModule,
    MatButton,
    MatCardActions,
    ItemSelectionList,
    AddMoreButton,
    MatProgressBar,
  ],
  templateUrl: './add-single-choice-field.component.html',
  styleUrl: './add-single-choice-field.component.scss'
})
export class AddSingleChoiceField implements OnInit {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  protected readonly oneOfFieldForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    options: this.formBuilder.array([
      this.createOption(),
      this.createOption()
    ])
  });
  protected fields: WritableSignal<Field[]>[] = AddSingleChoiceField.initFields();
  protected readonly isValid: Signal<boolean> = computed(() => {
    this.change();
    return this.oneOfFieldForm.valid;
  });
  protected readonly possibleFields: WritableSignal<Field[]> = signal([]);
  protected readonly processing: WritableSignal<boolean> = signal(false);
  private readonly change: Signal<any> = toSignal(this.oneOfFieldForm.valueChanges);
  private readonly snackbar: SnackbarService = inject(SnackbarService);
  private readonly singleChoiceFieldService: SingleChoiceFieldService = inject(SingleChoiceFieldService);
  private readonly fieldService: FieldService = inject(FieldService);

  public async ngOnInit(): Promise<void> {
    this.possibleFields.set(await this.fieldService.getAllFieldsAsync());
  }

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
    this.fields.push(AddSingleChoiceField.getFieldSignal());
  }

  protected deleteOption(id: number): void {
    for (let i = id; i < this.options.length - 1; i++) {
      this.options.at(i).setValue(this.options.at(i + 1).value);
    }

    this.options.removeAt(id);

    this.fields.splice(id, 1);
  }

  protected async submitFormField(): Promise<void> {
    if (!this.isValid()) {
      return;
    }

    const name: string | null = this.oneOfFieldForm.get('name')?.value;
    const optionNames: string[] | null = this.oneOfFieldForm.get('options')?.value;

    const selectedFields: Field[][] = this.fields.map(arr => arr());

    if (name === null
      || optionNames === null
      || optionNames.some(o => o === null)
      || selectedFields.flatMap(arr => arr)
        .some(f => f === null || f === undefined)) {
      this.snackbar.show('The form is still invalid');
      return;
    }

    const fieldIds: IdType[][] = selectedFields.map(arr => arr.map(f => f.id));
    let options: { name: string, fieldIds: IdType[] }[] = [];

    for (let i = 0; i < this.options.length && i < this.fields.length; i++) {
      options.push({
        name: optionNames[i],
        fieldIds: fieldIds[i]
      });
    }

    this.processing.set(true);
    try{
      await this.singleChoiceFieldService.createSingleChoiceFieldAsync(name, options);
      this.snackbar.show('The field was submitted successfully');
      this.resetForm();
    }
    finally{
      this.processing.set(false);
    }
  }

  private resetForm(): void {
    this.oneOfFieldForm.reset();
    this.fields = AddSingleChoiceField.initFields();
  }

  private static initFields(): WritableSignal<Field[]>[] {
    return [
      this.getFieldSignal(),
      this.getFieldSignal()
    ];
  }

  private static getFieldSignal(): WritableSignal<Field[]> {
    return signal<Field[]>([]);
  }
}
