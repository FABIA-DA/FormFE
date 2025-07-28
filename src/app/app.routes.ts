import { Routes } from '@angular/router';
import {Home} from './home/home';
import { Forms } from './forms/forms';
import {AddOneOfFormField} from './add-one-of-form-field/add-one-of-form-field';
import {AddFieldGroup} from './add-form-group/add-field-group.component';
import {AddFormField} from './add-field-field/add-form-field';
import {AddForm} from './add-form/add-form';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'forms', component: Forms },
  { path: 'add-form-field', component: AddFormField },
  { path: 'add-one-of-form-field', component: AddOneOfFormField },
  { path: 'add-field-group', component: AddFieldGroup },
  { path: 'add-form', component: AddForm },
  { path: '**', redirectTo: 'home' }
];
