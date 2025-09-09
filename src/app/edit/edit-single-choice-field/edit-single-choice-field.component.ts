import {Component, computed, inject, OnDestroy, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardTitle} from '@angular/material/card';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {MatFormField, MatInputModule, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {SnackbarService} from '../../../../core/service/snackbar-service';
import {toSignal} from '@angular/core/rxjs-interop';
import {ItemSelectionList} from '../../../../core/shared/item-selection-list/item-selection-list.component';
import {AddMoreButton} from '../../../../core/shared/add-more-button/add-more-button';
import {Field, FieldService} from '../../../../core/service/field-service';
import {Option, SingleChoiceField, SingleChoiceFieldService} from '../../../../core/service/single-choice-field-service';
import {IdType} from '../../../../core/service/base-service';
import {MatProgressBar} from '@angular/material/progress-bar';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {MatDivider} from '@angular/material/divider';

@Component({
  selector: 'app-edit-single-choice-field',
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
    MatDivider,
  ],
  templateUrl: './edit-single-choice-field.component.html',
  styleUrl: './edit-single-choice-field.component.scss'
})
export class EditSingleChoiceField implements OnInit, OnDestroy {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  protected readonly singleChoiceFieldForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    options: this.formBuilder.array([
      this.createOption(),
      this.createOption()
    ])
  });
  protected fields: WritableSignal<Field[]>[] = EditSingleChoiceField.initFields();
  protected readonly isValid: Signal<boolean> = computed(() => {
    this.change();
    return this.singleChoiceFieldForm.valid;
  });
  protected readonly possibleFields: WritableSignal<Field[]> = signal([]);
  protected readonly processing: WritableSignal<boolean> = signal(false);
  private readonly singleChoiceField: WritableSignal<SingleChoiceField | undefined> = signal(undefined);
  protected readonly isUpdate: Signal<boolean> = computed(() => {
    return this.singleChoiceField() !== undefined;
  });
  private readonly originalOptions: boolean[] = [];
  private readonly change: Signal<any> = toSignal(this.singleChoiceFieldForm.valueChanges);
  private readonly snackbar: SnackbarService = inject(SnackbarService);
  private readonly singleChoiceFieldService: SingleChoiceFieldService = inject(SingleChoiceFieldService);
  private readonly fieldService: FieldService = inject(FieldService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly subscriptions: Subscription[] = [];

  public async ngOnInit(): Promise<void> {
    this.possibleFields.set(await this.fieldService.getAllFieldsAsync());
    this.subscriptions.push(this.activatedRoute.params.subscribe(async params => {
      const id: IdType | undefined = params['id'];
      if(id === undefined){
        this.singleChoiceField.set(undefined);
        return;
      }
      this.processing.set(true);
      try{
        this.singleChoiceField.set(await this.singleChoiceFieldService.getSingleChoiceFieldByIdAsync(id));
        this.setFormValues();
      }
      finally{
        this.processing.set(false);
      }
    }))
  }

  ngOnDestroy(): void {
    for(const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  private setFormValues(): void {
    const field: SingleChoiceField | undefined = this.singleChoiceField();

    if(field === undefined){
      return;
    }

    this.singleChoiceFieldForm.get('name')?.setValue(field.name);
    if(this.singleChoiceField() === undefined){
      return;
    }
    const options: FormArray<AbstractControl<string | null>> = this.options;
    const savedOptions: Option[] = field.options;
    for(let i: number = 0; i < savedOptions.length; i++){
      this.originalOptions.push(true);
      if(i < options.length){
        this.setOptions(options, savedOptions, i);
        continue;
      }

      this.addOption();
      this.fields.push(EditSingleChoiceField.getFieldSignal());
      this.setOptions(options, savedOptions, i);
    }
    return;
  }

  private setOptions(options: FormArray<AbstractControl<string | null>>, savedOptions: Option[], idx: number): void {
    options.at(idx).setValue(savedOptions.at(idx) === undefined ? null : savedOptions.at(idx)!.name);

    const savedOption: Option | undefined = savedOptions.at(idx);
    if (!savedOption) {
      return;
    }

    const fieldList = Array.from(savedOption.fields);
    this.fields.at(idx)!().push(...fieldList);
  }

  private createOption(): AbstractControl<string | null> {
    return this.formBuilder.control('', Validators.required);
  }

  protected get options(): FormArray<AbstractControl<string | null>> {
    return this.singleChoiceFieldForm.get('options') as FormArray;
  }

  protected addOption(): void {
    this.options.push(
      this.createOption()
    );
    this.fields.push(EditSingleChoiceField.getFieldSignal());
    this.originalOptions.push(false);
  }

  protected deleteOption(id: number): void {
    this.options.removeAt(id);
    this.fields.splice(id, 1);
    this.originalOptions.pop();
  }

  protected async submitFormField(): Promise<void> {
    if (!this.isValid()) {
      return;
    }

    const name: string | null = this.singleChoiceFieldForm.get('name')?.value;
    const optionNames: string[] | null = this.singleChoiceFieldForm.get('options')?.value;

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

    for (let i: number = 0; i < this.options.length && i < this.fields.length; i++) {
      options.push({
        name: optionNames[i],
        fieldIds: fieldIds[i]
      });
    }

    this.processing.set(true);
    try{
      if(!this.isUpdate()){
        await this.singleChoiceFieldService.createSingleChoiceFieldAsync(name, options);
        this.resetForm();
      }
      else {
        const oldOptions: {id: IdType, name: string, fieldIds: IdType[]}[] = [];
        const newOptions: {name: string, fieldIds: IdType[]}[] = [];

        for(let i: number = 0; i < this.originalOptions.length; i++) {
          if(this.originalOptions[i]){
            oldOptions.push({
              id: this.singleChoiceField()!.options[i].id,
              name: options[i].name,
              fieldIds: options[i].fieldIds
            });
          }
          else{
            newOptions.push(options[i]);
          }
        }

        await this.singleChoiceFieldService.updateSingleChoiceFieldByIdAsync(this.singleChoiceField()!.id, name, oldOptions, newOptions);
      }
      this.snackbar.show('The field was submitted successfully');
    }
    finally{
      this.processing.set(false);
    }
  }

  private resetForm(): void {
    this.singleChoiceFieldForm.reset();
    this.fields = EditSingleChoiceField.initFields();
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
