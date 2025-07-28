import {Component, computed, inject, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardTitle} from '@angular/material/card';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatInputModule, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {DataFormField, OneOfField} from '../../../core/module';
import {SnackbarService} from '../../../core/service/snackbar-service';
import {toSignal} from '@angular/core/rxjs-interop';
import {ItemSelectionList} from '../../../core/shared/item-selection-list/item-selection-list.component';
import {AddMoreButton} from '../../../core/shared/add-more-button/add-more-button';
import {FormService} from '../../../core/service/form-service';

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
    MatButton,
    MatCardActions,
    ItemSelectionList,
    AddMoreButton,
  ],
  templateUrl: './add-one-of-form-field.html',
  styleUrl: './add-one-of-form-field.scss'
})
export class AddOneOfFormField implements OnInit {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  protected readonly oneOfFieldForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    options: this.formBuilder.array([
      this.createOption(),
      this.createOption()
    ])
  });
  protected fields: WritableSignal<DataFormField[]>[] = AddOneOfFormField.initFields();
  protected readonly isValid: Signal<boolean> = computed(() => {
    this.change();
    return this.oneOfFieldForm.valid;
  });
  protected readonly possibleDataFields: WritableSignal<DataFormField[]> = signal([]);
  private readonly change: Signal<any> = toSignal(this.oneOfFieldForm.valueChanges);
  private readonly snackbar: SnackbarService = inject(SnackbarService);
  private readonly service: FormService = inject(FormService);

  public async ngOnInit(): Promise<void> {
    this.possibleDataFields.set(await this.service.getDataFields());
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
    this.fields.push(AddOneOfFormField.getFieldSignal());
  }

  protected deleteOption(id: number): void {
    for(let i = id; i < this.options.length -1; i++){
      this.options.at(i).setValue(this.options.at(i + 1).value);
    }

    this.options.removeAt(id);

    this.fields.splice(id, 1);
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

    let map: Map<string, DataFormField[]> = new Map();

    for(let i = 0; i < this.options.length && i < this.fields.length; i++){
      map.set(options.at(i)!, this.fields[i]());
    }

    let oneOfFormField: OneOfField = {
      id: 0,
      name: name,
      optionsMap: map
    }

    await this.service.sendOneOfFormField(oneOfFormField);
    this.snackbar.show('The field was submitted successfully');
    this.resetForm();
  }

  private resetForm(): void {
    this.oneOfFieldForm.reset();
    this.fields = AddOneOfFormField.initFields();
  }

  private static initFields(): WritableSignal<DataFormField[]>[] {
    return [
      this.getFieldSignal(),
      this.getFieldSignal()
    ];
  }

  private static getFieldSignal(): WritableSignal<DataFormField[]> {
    return signal<DataFormField[]>([]);
  }
}
