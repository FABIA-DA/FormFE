import {Component, computed, inject, OnDestroy, OnInit, signal, Signal, WritableSignal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {toSignal} from '@angular/core/rxjs-interop';
import {
  Group,
  GroupListPresentation,
  GroupService,
  GroupZod,
  MinimalGroupZod
} from '../../../../core/service/group-service';
import {SnackbarService} from '../../../../core/service/snackbar-service';
import {Form, FormListPresentation, FormService, FormZod, MinimalFormZod} from '../../../../core/service/form-service';
import {MatCardModule} from '@angular/material/card';
import {MatError, MatFormField} from '@angular/material/form-field';
import {MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {ItemSelectionList} from '../../../../core/shared/item-selection-list/item-selection-list.component';
import {IdType, IdTypeZod} from '../../../../core/service/base-service';
import {MatDivider} from '@angular/material/divider';
import {MatDialog} from '@angular/material/dialog';
import {DialogItemData, DialogSelectItem} from '../../../../core/shared/dialog-select-item/dialog-select-item';
import {FieldGroupZod} from '../../../../core/service/field-group-service';
import {FieldZod} from '../../../../core/service/field-service';
import {OptionZod, SingleChoiceFieldZod} from '../../../../core/service/single-choice-field-service';
import {FieldTypeZod} from '../../../../core/service/field-type-service';
import {MatProgressBar} from '@angular/material/progress-bar';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-edit-group',
  imports: [MatCardModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatError, MatButton, ItemSelectionList, MatDivider, MatProgressBar],
  templateUrl: './edit-group.component.html',
  styleUrl: './edit-group.component.scss',
  standalone: true
})
export class EditGroup implements OnInit, OnDestroy {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  protected readonly groupForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required]
  });
  protected readonly isValid: Signal<boolean> = computed(() => {
    this.valueChanged();
    return this.groupForm.valid;
  });
  protected readonly possibleGroups: WritableSignal<GroupListPresentation[]> = signal([]);
  protected readonly selectedSubgroups: WritableSignal<GroupListPresentation[]> = signal([]);
  protected readonly selectedParent: WritableSignal<GroupListPresentation | undefined> = signal(undefined);
  protected readonly possibleForms: WritableSignal<FormListPresentation[]> = signal([]);
  protected readonly selectedForms: WritableSignal<FormListPresentation[]> = signal([]);
  protected readonly processing: WritableSignal<boolean> = signal(false);
  private readonly group: WritableSignal<Group | undefined> = signal(undefined);
  protected readonly isUpdate: Signal<boolean> = computed(() => {
    return this.group() !== undefined;
  });
  private readonly valueChanged: Signal<any> = toSignal(this.groupForm.valueChanges);
  private readonly groupService: GroupService = inject(GroupService);
  private readonly formService: FormService = inject(FormService);
  private readonly snackbar: SnackbarService = inject(SnackbarService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly subscriptions: Subscription[] = [];

  public async ngOnInit(): Promise<void> {
    this.possibleGroups.set(await this.groupService.getAllGroupsAsync());
    this.possibleForms.set(await this.formService.getAllFormsAsync());
    this.subscriptions.push(this.activatedRoute.params.subscribe(async params => {
      const id: IdType | undefined = params['id'];
      if(id === undefined){
        this.group.set(undefined);
        return;
      }

      this.processing.set(true);
      try{
        this.group.set(await this.groupService.getGroupByIdAsync(id));
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

  protected async onSubmit(): Promise<void> {
    if (!this.isValid()) {
      this.snackbar.show('The form is still invalid...');
      return;
    }

    const name: string | null = this.groupForm.get('name')?.value;
    const parentGroup: GroupListPresentation | undefined = this.selectedParent();
    const parentGroupId: IdType | null = parentGroup?.id === undefined ? null : parentGroup!.id;
    const subgroups: GroupListPresentation[] = this.selectedSubgroups();
    const forms: FormListPresentation[] = this.selectedForms();

    if (!name) {
      this.snackbar.show('Some fields are still invalid...');
      return;
    }

    const subgroupIds: IdType[] = subgroups.map(g => g.id);
    const formIds: IdType[] = forms.map(g => g.id);

    this.processing.set(true);
    try{
      if(!this.isUpdate()){
        await this.groupService.createGroupAsync(name, parentGroupId, subgroupIds, formIds);
        this.reset();
      }
      else {
        await this.groupService.updateGroupAsync(this.group()!.id, name, parentGroupId, subgroupIds, formIds);
      }
      this.snackbar.show('The group was submitted successfully');
    }
    finally{
      this.processing.set(false);
    }
  }

  private reset(): void {
    this.groupForm.reset();
    this.selectedParent.set(undefined);
    this.selectedSubgroups.set([]);
    this.selectedForms.set([]);
  }
}
