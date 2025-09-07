import {Component, computed, inject, OnDestroy, OnInit, signal, Signal, WritableSignal} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FieldType, FieldTypeService} from '../../../core/service/field-type-service';
import {toSignal} from '@angular/core/rxjs-interop';
import {SnackbarService} from '../../../core/service/snackbar-service';
import {MatError, MatFormField} from '@angular/material/form-field';
import {MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatProgressBar} from '@angular/material/progress-bar';
import {ActivatedRoute, Params} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {IdType} from '../../../core/service/base-service';

@Component({
  standalone: true,
  selector: 'app-edit-field-type',
  imports: [MatCardModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatError, MatButton, MatProgressBar],
  templateUrl: './edit-field-type.component.html',
  styleUrl: './edit-field-type.component.scss'
})
export class EditFieldType implements OnInit, OnDestroy{
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  protected readonly fieldType: WritableSignal<FieldType | undefined> = signal(undefined);
  protected readonly update: Signal<boolean> = computed(() => {
    return this.fieldType !== undefined;
  });
  protected readonly fieldTypeForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    regex: ['', Validators.required]
  });
  protected readonly isValid: Signal<boolean> = computed(() => {
      this.valueChanged();
      return this.fieldTypeForm.valid;
  });
  protected readonly processing: WritableSignal<boolean> = signal(false);
  private readonly valueChanged: Signal<any> = toSignal(this.fieldTypeForm.valueChanges);
  private readonly snackbar: SnackbarService = inject(SnackbarService);
  private readonly fieldTypeService: FieldTypeService = inject(FieldTypeService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.subscriptions.push(this.activatedRoute.params.subscribe(async params => {
      const id: IdType = params['id'] as IdType;
      this.processing.set(true);
      try{
        this.fieldType.set(await this.fieldTypeService.getFieldTypeByIdAsync(id));
        this.setFormValues();
      }
      finally{
        this.processing.set(false);
      }
    }));
  }

  ngOnDestroy(): void {
    for(const subscription of this.subscriptions){
      subscription.unsubscribe();
    }
  }

  private setFormValues(): void {
    this.fieldTypeForm.get('name')?.setValue(this.fieldType()?.name);
    this.fieldTypeForm.get('description')?.setValue(this.fieldType()?.description);
    this.fieldTypeForm.get('regex')?.setValue(this.fieldType()?.regex);
  }

  protected async onSubmit(): Promise<void> {
    if(!this.isValid()){
      this.snackbar.show('The form is still invalid...');
      return;
    }

    const name: string | null = this.fieldTypeForm.get('name')?.value;
    let description: string | null = this.fieldTypeForm.get('description')?.value;
    const regex: string | null = this.fieldTypeForm.get('regex')?.value;

    description = description?.length === 0 ? null : description;

    if(!name
    || !regex){
      this.snackbar.show('Some fields are still invalid...');
      return;
    }

    this.processing.set(true);
    try{
      if(!this.update()){
        await this.fieldTypeService.createFieldTypeAsync(name, description, regex);
        this.fieldTypeForm.reset();
      }
      else{
        await this.fieldTypeService.updateFieldTypeAsync(this.fieldType()!.id, name, description, regex);
      }
      this.snackbar.show('Field type was submitted successfully.');
    }
    finally {
      this.processing.set(false);
    }
  }
}
