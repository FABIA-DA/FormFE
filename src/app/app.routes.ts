import {Routes} from '@angular/router';
import {Home} from './home/home';
import {EditSingleChoiceField} from './edit-single-choice-field/edit-single-choice-field.component';
import {EditFieldGroup} from './edit-field-group/edit-field-group.component';
import {EditField} from './edit-field/edit-field.component';
import {EditForm} from './edit-form/edit-form.component';
import {EditFieldType} from './edit-field-type/edit-field-type.component';
import {EditGroup} from './edit-group/edit-group.component';
import {ListFieldTypes} from './list-field-types/list-field-types';
import {ListFields} from './list-fields/list-fields.component';
import {ListSingleChoiceFields} from './list-single-choice-fields/list-single-choice-fields';
import {ListFieldGroups} from './list-field-groups/list-field-groups';
import {ListForms} from './list-forms/list-forms';
import {ListGroups} from './list-groups/list-groups';

export const routes: Routes = [
  {path: 'home', component: Home},
  {path: 'list-field-types', component: ListFieldTypes},
  {path: 'list-fields', component: ListFields},
  {path: 'list-single-choice-fields', component: ListSingleChoiceFields},
  {path: 'list-field-groups', component: ListFieldGroups},
  {path: 'list-forms', component: ListForms},
  {path: 'list-groups', component: ListGroups},
  {path: 'edit-field-type', component: EditFieldType},
  {path: 'edit-field', component: EditField},
  {path: 'edit-single-choice-field', component: EditSingleChoiceField},
  {path: 'edit-field-group', component: EditFieldGroup},
  {path: 'edit-form', component: EditForm},
  {path: 'edit-group', component: EditGroup},
  {path: 'edit-field-type/:id', component: EditFieldType},
  {path: 'edit-field/:id', component: EditField},
  {path: 'edit-single-choice-field/:id', component: EditSingleChoiceField},
  {path: 'edit-field-group/:id', component: EditFieldGroup},
  {path: 'edit-form/:id', component: EditForm},
  {path: 'edit-group/:id', component: EditGroup},
  {path: '**', redirectTo: 'home'}
];
