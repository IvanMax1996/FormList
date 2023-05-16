export interface iUsers {
  id: string,
  name: string,
  surname: string,
  email: string,
  phone: string,
  idBtn: string
  validate: {
    nameValidate: boolean,
    emailValidate: boolean,
    phoneValidate: boolean
  }
}

export interface iUsersCopy {
  id: string,
  fullName: string,
  email: string,
  phone: string,
  checked: boolean,
  itemVisible: boolean,
  idBtn: string,
  validate: {
    nameValidate: boolean,
    emailValidate: boolean,
    phoneValidate: boolean
  }
}
