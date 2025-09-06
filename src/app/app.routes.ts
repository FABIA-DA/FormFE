import {Routes} from '@angular/router';
import {Home} from './home/home';
import {AddSingleChoiceField} from './add-single-choice-field/add-single-choice-field.component';
import {AddFieldGroup} from './add-field-group/add-field-group.component';
import {AddField} from './add-field/add-field.component';
import {AddForm} from './add-form/add-form';
import {AddFieldType} from './add-field-type/add-field-type';
import {AddGroup} from './add-group/add-group';
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
  {path: 'add-field-type', component: AddFieldType},
  {path: 'add-field', component: AddField},
  {path: 'add-single-choice-field', component: AddSingleChoiceField},
  {path: 'add-field-group', component: AddFieldGroup},
  {path: 'add-form', component: AddForm},
  {path: 'add-group', component: AddGroup},
  {path: '**', redirectTo: 'home'}
];
