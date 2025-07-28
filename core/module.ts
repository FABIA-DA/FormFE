export interface Form {
  id: number,
  name: string,
  info: string,
  //receiver: Receiver
  groups: FieldGroup[]
}

export interface Receiver {
  id: number,
  name: string,
  postCode: string,
  streetName: string,
  streetNumber: string,
}

export interface FieldGroup {
  id: number,
  name: string,
  fields: Array<OneOfField | DataFormField>
}

export interface FormField {
  id: number,
  name: string
}

export interface OneOfField extends FormField {
  optionsMap: Map<string, DataFormField[]>
}

export interface DataFormField extends FormField {
  description: string | null,
  isOptional: boolean,
  type: string
}
