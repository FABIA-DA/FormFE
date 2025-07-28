import {Component, computed, inject, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {DataFormField, FieldGroup, OneOfField} from '../../../core/module';
import {FormService} from '../../../core/service/form-service';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {ItemSelectionList} from '../../../core/shared/item-selection-list/item-selection-list.component';
import {MatButton} from '@angular/material/button';
import {toSignal} from '@angular/core/rxjs-interop';
import {SnackbarService} from '../../../core/service/snackbar-service';

@Component({
  selector: 'app-add-field-group',
  imports: [
    MatCardModule,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatError,
    MatInput,
    ItemSelectionList,
    MatButton,
  ],
  templateUrl: './add-field-group.component.html',
  styleUrl: './add-field-group.component.scss'
})
export class AddFieldGroup implements OnInit {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  protected readonly name: FormControl = this.formBuilder.control('', Validators.required);
  protected readonly selectedFields: WritableSignal<Array<OneOfField | DataFormField>> = signal([]);
  protected readonly possibleFields: WritableSignal<Array<OneOfField | DataFormField>> = signal([]);
  protected readonly isValid: Signal<boolean> = computed(() => {
    this.change();
    return this.name.valid;
  });
  private readonly change: Signal<any> = toSignal(this.name.valueChanges);
  private readonly snackbar: SnackbarService = inject(SnackbarService);
  private readonly service: FormService = inject(FormService);

  public async ngOnInit(): Promise<void> {
    this.possibleFields.set([...await this.service.getOneOfFormFields(), ...await this.service.getDataFields()]);
  }

  protected async submitFormGroup(): Promise<void> {
    if(!this.isValid()){
      return;
    }

    const name: string | undefined = this.name.value;

    if(!name) {
      this.snackbar.show('The form is still invalid');
      return;
    }

    const selected: Array<OneOfField | DataFormField> = this.selectedFields();

    const data: FieldGroup = {
      id: 0,
      name: name,
      fields: selected
    };

    await this.service.sendFieldGroup(data);
    this.snackbar.show('The field group was submitted successfully');
    this.resetForm();
  }

  private resetForm(): void {
    this.name.reset();
    this.selectedFields.set([]);
  }
}
