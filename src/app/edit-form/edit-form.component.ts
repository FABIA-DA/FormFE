import {Component, computed, inject, OnInit, signal, Signal, WritableSignal} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {toSignal} from '@angular/core/rxjs-interop';
import {SnackbarService} from '../../../core/service/snackbar-service';
import {FormService} from '../../../core/service/form-service';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {ItemSelectionList} from '../../../core/shared/item-selection-list/item-selection-list.component';
import {FieldGroup, FieldGroupService} from '../../../core/service/field-group-service';
import {IdType} from '../../../core/service/base-service';
import {Group} from '../../../core/service/group-service';
import {MatDivider} from '@angular/material/divider';
import {MatProgressBar} from '@angular/material/progress-bar';

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
    ItemSelectionList,
    MatDivider,
    MatProgressBar
  ],
  templateUrl: './add-form.html',
  styleUrl: './add-form.scss',
  standalone: true
})
export class AddForm implements OnInit {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  protected readonly formForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
  });
  protected readonly isValid: Signal<boolean> = computed(() => {
    this.change();
    return this.formForm.valid;
  });
  protected readonly possibleGroups: WritableSignal<Group[]> = signal([]);
  protected readonly selectedGroup: WritableSignal<Group | undefined> = signal(undefined);
  protected readonly selectedFieldGroups: WritableSignal<FieldGroup[]> = signal([]);
  protected readonly possibleFieldGroups: WritableSignal<FieldGroup[]> = signal([]);
  protected readonly processing: WritableSignal<boolean> = signal(false);
  private readonly change: Signal<any> = toSignal(this.formForm.valueChanges);
  private readonly snackbar: SnackbarService = inject(SnackbarService);
  private readonly formService: FormService = inject(FormService);
  private readonly fieldGroupService: FieldGroupService = inject(FieldGroupService);

  public async ngOnInit(): Promise<void> {
    this.possibleFieldGroups.set(await this.fieldGroupService.getAllFieldGroupsAsync());
  }

  protected async submitForm(): Promise<void>{
    if(!this.isValid()){
      return;
    }

    const name: string | undefined = this.formForm.get('name')?.value;

    if(!name){
      this.snackbar.show('The form is still invalid');
      return;
    }

    const groupId: IdType | null = null;
    const fieldGroupIds: IdType[] = this.selectedFieldGroups().map(g => g.id);

    this.processing.set(true);
    try{
      await this.formService.createFormAsync(name, groupId, fieldGroupIds);
      this.snackbar.show('The form was submitted successfully');
      this.resetForm();
    }
    finally{
      this.processing.set(false);
    }
  }

  private resetForm(): void {
    this.formForm.reset();
    this.selectedFieldGroups.set([]);
  }
}
