import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {DataFormField, FieldGroup, Form, OneOfField} from '../module';

@Injectable({
  providedIn: 'root'
})
export class FormService extends BaseService {
  protected override get controller(): string {
    return `'form`;
  }

  public async getDataFieldTypes(): Promise<string[]> {
    return ['Number', 'String', 'Email', 'Telephone Number', '...'];
  }

  public async getDataFields(): Promise<DataFormField[]> {
    return [
      {
        id: 0,
        name: 'Email Field',
        description: '',
        isOptional: false,
        type: 'email'
      },
      {
        id: 1,
        name: 'Tele Field',
        description: '',
        isOptional: false,
        type: 'tele'
      },
      {
        id: 2,
        name: 'Sirname Field',
        description: '',
        isOptional: false,
        type: 'text'
      },
      {
        id: 3,
        name: 'Title Field',
        description: '',
        isOptional: false,
        type: 'text'
      },
    ];
  }

  public async sendDataField(field: DataFormField): Promise<void> {
    console.log(field);
  }

  public async getOneOfFormFields(): Promise<OneOfField[]> {
    return [
      {
        id: 0,
        name: "Group a",
        optionsMap: new Map<string, DataFormField[]>([
          ["Option a",
            [
              {
                id: 0,
                name: 'Email',
                description: '',
                isOptional: false,
                type: 'email'
              },
              {
                id: 1,
                name: 'Tele',
                description: '',
                isOptional: false,
                type: 'tele'
              }
            ]],
          ["Option c", []],
        ])
      },
      {
        id: 1,
        name: "Group b",
        optionsMap: new Map<string, DataFormField[]>([
          ["c",
            [
              {
                id: 0,
                name: 'Email',
                description: '',
                isOptional: false,
                type: 'email'
              },
              {
                id: 1,
                name: 'Tele',
                description: '',
                isOptional: false,
                type: 'tele'
              }
            ]],
          ["d", []],
        ])
      }
    ];
  }

  public async sendOneOfFormField(field: OneOfField): Promise<void> {
    console.log(field);
  }

  public async getFieldGroups(): Promise<FieldGroup[]> {
    return [];
  }

  public async sendFieldGroup(group: FieldGroup): Promise<void> {
    console.log(group);
  }

  public async getForms(): Promise<Form[]> {
    return [];
  }

  public async sendForm(data: Form): Promise<void>{
    console.log(data);
  }
}
