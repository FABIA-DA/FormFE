import {Component, computed, inject, OnDestroy, OnInit, signal, Signal, WritableSignal} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton, MatFabButton} from '@angular/material/button';
import {toSignal} from '@angular/core/rxjs-interop';
import {SnackbarService} from '../../../../core/service/snackbar-service';
import {Form, FormService} from '../../../../core/service/form-service';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {ItemSelectionList} from '../../../../core/shared/item-selection-list/item-selection-list.component';
import {FieldGroupListPresentation, FieldGroupService} from '../../../../core/service/field-group-service';
import {IdType} from '../../../../core/service/base-service';
import {GroupListPresentation, GroupService} from '../../../../core/service/group-service';
import {MatDivider} from '@angular/material/divider';
import {MatProgressBar} from '@angular/material/progress-bar';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Subscription} from 'rxjs';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-edit-form',
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
    MatProgressBar,
    MatFabButton,
    MatIcon,
    RouterLink
  ],
  templateUrl: './edit-form.component.html',
  styleUrl: './edit-form.component.scss',
  standalone: true
})
export class EditForm implements OnInit, OnDestroy {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  protected readonly formForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
  });
  protected readonly isValid: Signal<boolean> = computed(() => {
    this.change();
    return this.formForm.valid;
  });
  protected readonly possibleGroups: WritableSignal<GroupListPresentation[]> = signal([]);
  protected readonly selectedGroup: WritableSignal<GroupListPresentation | undefined> = signal(undefined);
  protected readonly selectedFieldGroups: WritableSignal<FieldGroupListPresentation[]> = signal([]);
  protected readonly possibleFieldGroups: WritableSignal<FieldGroupListPresentation[]> = signal([]);
  protected readonly processing: WritableSignal<boolean> = signal(false);
  protected readonly form: WritableSignal<Form | undefined> = signal(undefined);
  protected readonly isUpdate: Signal<boolean> = computed(() => {
    return this.form() !== undefined;
  });
  private readonly change: Signal<any> = toSignal(this.formForm.valueChanges);
  private readonly snackbar: SnackbarService = inject(SnackbarService);
  private readonly formService: FormService = inject(FormService);
  private readonly fieldGroupService: FieldGroupService = inject(FieldGroupService);
  private readonly groupService: GroupService = inject(GroupService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly subscriptions: Subscription[] = [];

  public async ngOnInit(): Promise<void> {
    this.possibleGroups.set(await this.groupService.getAllGroupsAsync());
    this.possibleFieldGroups.set(await this.fieldGroupService.getAllFieldGroupsAsync());
    this.subscriptions.push(this.activatedRoute.params.subscribe(async params => {
      const id: IdType | undefined = params['id'];
      if(id === undefined) {
        this.form.set(undefined);
        return;
      }

      this.processing.set(true);
      try{
        this.form.set(await this.formService.getFormByIdAsync(id));
        this.setFormValues();
      }
      finally {
        this.processing.set(false);
      }
    }));
  }

  public ngOnDestroy(): void {
    for(const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  private setFormValues(): void {
    const form: Form | undefined = this.form();

    if(!form){
      return;
    }

    const groups = this.possibleGroups().filter(g => {
      return g.id === form.groupId;
    });

    const selectedFieldGroups = form.fieldGroups.map(fg => fg.id);
    const fieldGroups = this.possibleFieldGroups().filter(fg => {
      return selectedFieldGroups.includes(fg.id)
    });

    this.formForm.get('name')?.setValue(form.name);
    this.selectedGroup.set(groups.length === 0 ? undefined : groups[0]);
    this.selectedFieldGroups.set(fieldGroups);
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
      if(!this.isUpdate()){
        await this.formService.createFormAsync(name, groupId, fieldGroupIds);
        this.resetForm();
      }
      else{
        await this.formService.updateFormByIdAsync(this.form()!.id, name, groupId, fieldGroupIds);
      }
      this.snackbar.show('The form was submitted successfully');
    }
    finally{
      this.processing.set(false);
    }
  }

  private resetForm(): void {
    this.formForm.reset();
    this.selectedGroup.set(undefined);
    this.selectedFieldGroups.set([]);
  }
}
