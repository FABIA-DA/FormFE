import {Component, computed, inject, OnDestroy, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {ItemSelectionList} from '../../../../core/shared/item-selection-list/item-selection-list.component';
import {MatButton} from '@angular/material/button';
import {toSignal} from '@angular/core/rxjs-interop';
import {SnackbarService} from '../../../../core/service/snackbar-service';
import {FieldGroup, FieldGroupService} from '../../../../core/service/field-group-service';
import {
  SingleChoiceField,
  SingleChoiceFieldService
} from '../../../../core/service/single-choice-field-service';
import {Field, FieldService} from '../../../../core/service/field-service';
import {IdType} from '../../../../core/service/base-service';
import {MatDivider} from '@angular/material/divider';
import {MatProgressBar} from '@angular/material/progress-bar';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-edit-field-group',
  imports: [
    MatCardModule,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatError,
    MatInput,
    ItemSelectionList,
    MatButton,
    MatDivider,
    MatProgressBar,
  ],
  templateUrl: './edit-field-group.component.html',
  styleUrl: './edit-field-group.component.scss',
  standalone: true
})
export class EditFieldGroup implements OnInit, OnDestroy {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  protected readonly name: FormControl = this.formBuilder.control('', Validators.required);
  protected readonly selectedFields: WritableSignal<Field[]> = signal([]);
  protected readonly possibleFields: WritableSignal<Field[]> = signal([]);
  protected readonly selectedSingleChoiceFields: WritableSignal<SingleChoiceField[]> = signal([]);
  protected readonly possibleSingleChoiceFields: WritableSignal<SingleChoiceField[]> = signal([]);
  protected readonly isValid: Signal<boolean> = computed(() => {
    this.change();
    return this.name.valid;
  });
  protected readonly processing: WritableSignal<boolean> = signal(false);
  private readonly fieldGroup: WritableSignal<FieldGroup | undefined> = signal(undefined);
  protected readonly isUpdate: Signal<boolean> = computed(() => {
    return this.fieldGroup() !== undefined;
  });
  private readonly change: Signal<any> = toSignal(this.name.valueChanges);
  private readonly snackbar: SnackbarService = inject(SnackbarService);
  private readonly fieldGroupService: FieldGroupService = inject(FieldGroupService);
  private readonly singleChoiceFieldService: SingleChoiceFieldService = inject(SingleChoiceFieldService);
  private readonly fieldService: FieldService = inject(FieldService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly subscriptions: Subscription[] = [];

  public async ngOnInit(): Promise<void> {
    this.possibleFields.set(await this.fieldService.getAllFieldsAsync());
    this.possibleSingleChoiceFields.set(await this.singleChoiceFieldService.getAllSingleChoiceFieldsAsync());
    this.subscriptions.push(this.activatedRoute.params.subscribe(async params => {
      const id: IdType | undefined = params['id'];
      if(id === undefined){
        this.fieldGroup.set(undefined);
        return;
      }

      this.processing.set(true);
      try{
        this.fieldGroup.set(await this.fieldGroupService.getFieldGroupByIdAsync(id));
      }
      finally{
        this.processing.set(false);
      }
    }));
  }

  public ngOnDestroy(): void {
    for(const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  protected async submitFormGroup(): Promise<void> {
    if (!this.isValid()) {
      return;
    }

    const name: string | undefined = this.name.value;

    if (!name) {
      this.snackbar.show('The form is still invalid');
      return;
    }

    const fieldIds: IdType[] = this.selectedFields().map(f => f.id);
    const singleChoiceFieldIds: IdType[] = this.selectedSingleChoiceFields().map(f => f.id);

    this.processing.set(true);
    try {
      if(this.isUpdate()){
        await this.fieldGroupService.createFieldGroupAsync(name, fieldIds, singleChoiceFieldIds);
        this.resetForm();
      }
      else{
        await this.fieldGroupService.updateFieldGroupByIdAsync(this.fieldGroup()!.id, name, singleChoiceFieldIds, fieldIds);
      }
      this.snackbar.show('The field group was submitted successfully');
    } finally {
      this.processing.set(false);
    }
  }

  private resetForm(): void {
    this.name.reset();
    this.selectedFields.set([]);
  }
}
