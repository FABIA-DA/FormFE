export interface Form {
  name: string,
  info: string,
  receiver: Receiver
  groups: FieldGroup[]
}

export interface Receiver {
  name: string,
  postCode: string,
  streetName: string,
  streetNumber: string,
}

export interface FieldGroup {
  name: string,
  fields: Array<FormField | OneOfField>
}

export interface OneOfField {
  name: string,
  optionsMap: Map<string, Array<FormField>>
}

export interface FormField {
  id: number,
  name: string;
  description: string | null,
  isOptional: boolean,
  type: string
}
