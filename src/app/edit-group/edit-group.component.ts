import {Component, computed, inject, OnInit, signal, Signal, WritableSignal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {toSignal} from '@angular/core/rxjs-interop';
import {Group, GroupService, GroupZod, MinimalGroupZod} from '../../../core/service/group-service';
import {SnackbarService} from '../../../core/service/snackbar-service';
import {Form, FormService, FormZod, MinimalFormZod} from '../../../core/service/form-service';
import {MatCardModule} from '@angular/material/card';
import {MatError, MatFormField} from '@angular/material/form-field';
import {MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {ItemSelectionList} from '../../../core/shared/item-selection-list/item-selection-list.component';
import {IdType, IdTypeZod} from '../../../core/service/base-service';
import {MatDivider} from '@angular/material/divider';
import {MatDialog} from '@angular/material/dialog';
import {DialogItemData, DialogSelectItem} from '../../../core/shared/dialog-select-item/dialog-select-item';
import {FieldGroupZod} from '../../../core/service/field-group-service';
import {FieldZod} from '../../../core/service/field-service';
import {OptionZod, SingleChoiceFieldZod} from '../../../core/service/single-choice-field-service';
import {FieldTypeZod} from '../../../core/service/field-type-service';
import {MatProgressBar} from '@angular/material/progress-bar';

@Component({
  selector: 'app-edit-group',
  imports: [MatCardModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatError, MatButton, ItemSelectionList, MatDivider, MatProgressBar],
  templateUrl: './edit-group.component.html',
  styleUrl: './edit-group.component.scss',
  standalone: true
})
export class EditGroup implements OnInit {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  protected readonly groupForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required]
  });
  protected readonly isValid: Signal<boolean> = computed(() => {
    this.valueChanged();
    return this.groupForm.valid;
  });
  protected readonly possibleGroups: WritableSignal<Group[]> = signal([]);
  protected readonly selectedSubgroups: WritableSignal<Group[]> = signal([]);
  protected readonly selectedParent: WritableSignal<Group | undefined> = signal(undefined);
  protected readonly possibleForms: WritableSignal<Form[]> = signal([]);
  protected readonly selectedForms: WritableSignal<Form[]> = signal([]);
  protected readonly processing: WritableSignal<boolean> = signal(false);
  private readonly valueChanged: Signal<any> = toSignal(this.groupForm.valueChanges);
  private readonly groupService: GroupService = inject(GroupService);
  private readonly formService: FormService = inject(FormService);
  private readonly snackbar: SnackbarService = inject(SnackbarService);
  private readonly dialog: MatDialog = inject(MatDialog);

  async ngOnInit(): Promise<void> {
    console.log('GroupZod', GroupZod);
    console.log('MinimalGroupZod', MinimalGroupZod);
    console.log('IdTypeZod', IdTypeZod);
    console.log('MinimalFormZod', MinimalFormZod);
    console.log('FormZod', FormZod);
    console.log('FieldGroupZod', FieldGroupZod);
    console.log('FieldZod', FieldZod);
    console.log('SingleChoiceFieldZod', SingleChoiceFieldZod);
    console.log('OptionZod', OptionZod);
    console.log('FieldTypeZod', FieldTypeZod);
    this.possibleGroups.set(await this.groupService.getAllGroupsAsync());
    this.possibleForms.set(await this.formService.getAllFormsAsync());
  }

  protected openParentDialog(): void {
    const data: DialogItemData<Group> = {
      possibleItems: this.possibleGroups(),
      itemName: 'Group'
    };

    const dialogRef = this.dialog.open(DialogSelectItem<Group>, {
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      this.selectedParent.set(result);
    });
  }

  protected async onSubmit(): Promise<void> {
    if (!this.isValid()) {
      this.snackbar.show('The form is still invalid...');
      return;
    }

    const name: string | null = this.groupForm.get('name')?.value;
    const parentGroup: Group | undefined = this.selectedParent();
    const subgroups: Group[] = this.selectedSubgroups();
    const forms: Form[] = this.selectedForms();

    if (!name) {
      this.snackbar.show('Some fields are still invalid...');
      return;
    }

    const subgroupIds: IdType[] = subgroups.map(g => g.id);
    const formIds: IdType[] = forms.map(g => g.id);

    this.processing.set(true);
    try{
      await this.groupService.createGroupAsync(name, parentGroup?.id === undefined ? null : parentGroup?.id, subgroupIds, formIds);
      this.snackbar.show('The group was submitted successfully');
      this.reset();
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
