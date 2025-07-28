import {Component, computed, inject, OnInit, signal, Signal, WritableSignal} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {toSignal} from '@angular/core/rxjs-interop';
import {SnackbarService} from '../../../core/service/snackbar-service';
import {FieldGroup, Form} from '../../../core/module';
import {FormService} from '../../../core/service/form-service';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {ItemSelectionList} from '../../../core/shared/item-selection-list/item-selection-list.component';

@Component({
  selector: 'app-add-form',
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatButton,
    MatFormField,
    MatInput,
    MatError,
    MatLabel,
    ItemSelectionList
  ],
  templateUrl: './add-form.html',
  styleUrl: './add-form.scss'
})
export class AddForm implements OnInit {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  protected readonly formForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    info: ['']
  });
  protected readonly isValid: Signal<boolean> = computed(() => {
    this.change();
    return this.formForm.valid;
  });
  protected readonly selectedFieldGroups: WritableSignal<FieldGroup[]> = signal([]);
  protected readonly possibleFieldGroups: WritableSignal<FieldGroup[]> = signal([]);
  private readonly change: Signal<any> = toSignal(this.formForm.valueChanges);
  private readonly snackbar: SnackbarService = inject(SnackbarService);
  private readonly service: FormService = inject(FormService);

  public async ngOnInit(): Promise<void> {
    this.possibleFieldGroups.set(await this.service.getFieldGroups());
  }

  protected async submitForm(): Promise<void>{
    if(!this.isValid()){
      return;
    }

    const name: string | undefined = this.formForm.get('name')?.value;
    const info: string | undefined = this.formForm.get('info')?.value;

    if(!name
    || !info){
      this.snackbar.show('The form is still invalid');
      return;
    }

    const groups: FieldGroup[] = this.selectedFieldGroups();

    const data: Form = {
      id: 0,
      name: name,
      info: info,
      groups: groups
    };

    await this.service.sendForm(data);
    this.snackbar.show('The form was submitted successfully');
    this.resetForm();
  }

  private resetForm(): void {
    this.formForm.reset();
    this.selectedFieldGroups.set([]);
  }
}
