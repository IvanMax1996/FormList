import {Component, OnInit, Renderer2} from '@angular/core';
import {iUsers, iUsersCopy} from "./interface/users.interface";
import {HttpService} from "./service/http.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [HttpService]
})
export class AppComponent implements OnInit {
  count: number = 0;
  modalVisible: boolean = false;
  allIdDelete: string[] = [];
  usersCopy!: iUsersCopy[];
  users$!: Observable<iUsers[]>;
  checkboxDisabled: boolean = false;
  phoneValid: boolean = true;
  fullNameValid: boolean = true;
  emailValid: boolean = true;
  addFormVisible: boolean = false;
  addItemFullName : string = '';

  userAddItem: iUsers = {
    id: '',
    name: '',
    surname: '',
    email: '',
    phone: '',
    idBtn: '',
    validate: {
      nameValidate: false,
      emailValidate: false,
      phoneValidate: false
    }
  }

  constructor(private httpService: HttpService, private renderer: Renderer2) {}

  postUser() {
    if (this.phoneValid || this.emailValid || this.fullNameValid) return;

    let alphabet = 'abcdеfghijklmnopqrstuvwxyz',
        randomId = '';

    for (let i = 0; i < 10; i++) {
      randomId += alphabet[Math.round(Math.random() * (alphabet.length - 1))];
    }

    this.userAddItem.idBtn = randomId;
    this.addItemVisible();

    this.httpService.postUser(this.userAddItem).subscribe(response => {
      this.userAddItem = {
        id: '',
        name: '',
        surname: '',
        email: '',
        phone: '',
        idBtn: '',
        validate: {
          nameValidate: false,
          emailValidate: false,
          phoneValidate: false
        }
      }

      this.addItemFullName = '';

      this.ngOnInit();
    })
  }

  mouseOver(event: any, i: number): void {
    // Выполняем код если у чекбокса checked - false
    if (!this.usersCopy[i].checked) {
      // Записываем таргет
      let target = event.target;

      // Меняем фон если нет кнопок конфигураций
      if (target.querySelectorAll('.form-item__edit-btn').length < 1) {
        target.classList.add('form-container__content_background');
      }

      // Формируем контйнер с кнопкой редактирования
      let divEdit = document.createElement('div');
      let btnEdit = document.createElement('button');
      let imgEdit = document.createElement('img');

      divEdit.style.cssText = "display: flex; justify-content: center; align-items: center; cursor: pointer; width: 70px;";
      btnEdit.style.cssText = "background: none; cursor: pointer;";
      imgEdit.style.cssText = "width: 32px; height: 32px;"

      imgEdit.classList.add('item-img');
      divEdit.classList.add('form-item__edit');
      imgEdit.src = "./assets/images/icon-edit.svg";

      btnEdit.append(imgEdit);
      divEdit.append(btnEdit);

      // Формируем контейнер с кнопками конфигурации
      let divBtn = document.createElement('div');
      let btnSave = document.createElement('button');
      let btnCancel = document.createElement('button');

      divBtn.style.cssText = "display: flex; column-gap: 8px; padding-right: 16px";
      btnSave.style.cssText = "cursor: pointer; height: 36px; width: 94px; background: #0080FF; border-radius: 8px; border: none; color: white;";
      btnCancel.style.cssText = "cursor: pointer; height: 36px; width: 94px; background: white; border-radius: 8px; border: 1px solid #979797; color: #979797;";

      btnSave.innerHTML = 'Сохранить';
      btnSave.id = this.usersCopy[i].idBtn;
      btnCancel.innerHTML = 'Отменить';

      btnSave.classList.add('form-item__btn-save');
      divBtn.classList.add('form-item__edit-btn');
      divBtn.style.display = 'flex';

      divBtn.append(btnSave);
      divBtn.append(btnCancel);

      // Событие клика по кнопке редактирования
      btnEdit.addEventListener("click", (): void => {
        if (!this.addFormVisible) {
          // Переменная наличия активного чекбокса
          let checkTrue = false;

          // Проверка на наличие активного чекбокса
          this.usersCopy.forEach((item: any) => {
            if (item.checked) checkTrue = true;
          })

          // Логика кнопки редактирования
          if (!checkTrue) {
            target.classList.remove('form-container__content_background');
            divEdit.style.display = 'none';
            target.append(divBtn);

            // Переключаемся в режим редактирования по условию
            this.usersCopy[i].itemVisible = true

            // Убираем возможность выбора чекбокса
            this.checkboxDisabled = true;
          }
        }

      })

      // Кнопка отмены
      btnCancel.addEventListener('click', (): void => {
        this.editBtnVisible(target, i, divEdit);
      })

      // Кнопка сохранения
      btnSave.addEventListener('click', (): void => {
        if (this.usersCopy[i].validate.phoneValidate || this.usersCopy[i].validate.emailValidate || this.usersCopy[i].validate.nameValidate) return
        this.editBtnVisible(target, i, divEdit);

        // Формируем данные
        let fullName = target.querySelector('.form-item-input__full-name').value;
        let email = target.querySelector('.form-item-input__email').value;
        let phone = target.querySelector('.form-item-input__phone').value;
        let id = this.usersCopy[i].id;
        let idBtn = this.usersCopy[i].idBtn;
        let name = fullName.split(' ',2)[0];
        let surname = fullName.split(' ', 2)[1];

        // Собираем объект данных для отображения
        let user: iUsersCopy = {
          id: '',
          fullName: '',
          email: '',
          phone: '',
          checked: false,
          itemVisible: false,
          idBtn: '',
          validate: {
            nameValidate: false,
            emailValidate: false,
            phoneValidate: false
          }
        }

        user.id = id;
        user.fullName = fullName;
        user.email = email;
        user.phone = phone;
        user.idBtn = idBtn;

        this.usersCopy[i] = user;

        // Собираем объект данных для изменения базы
        let userPut: iUsers = {
          id: '',
          name: '',
          surname: '',
          email: '',
          phone: '',
          idBtn: '',
          validate: {
            nameValidate: false,
            emailValidate: false,
            phoneValidate: false
          }
        }

        userPut.id = id;
        userPut.name = name;
        userPut.email = email;
        userPut.phone = phone;
        userPut.surname = surname;
        userPut.idBtn = idBtn;

        // PUT запрос на изменение данных
        this.httpService.putUsers(id, userPut).subscribe(data => data);

      })

      // Добавляем кнопку редактирования при сохранении данных
      if (target.querySelectorAll('.form-item__edit').length < 1 && target.querySelectorAll('.form-item__edit-btn').length < 1) {
        target.append(divEdit);
      }
    }
  }

  addItemVisible() {
    this.addFormVisible = !this.addFormVisible;
    this.checkboxDisabled = !this.checkboxDisabled;
  }

  // Метод конфигураций при отмене и сохранении значений
  editBtnVisible(target: any, i: number, divEdit: any): void {
    // Смена фона
    target.classList.add('form-container__content_background');

    // Возвращаем видимость кнопки редактирования
    divEdit.style.display = 'flex';

    // Возвращаем возможность выбора чекбокса
    if (document.querySelectorAll('.form-item__edit-btn').length == 1) {
      this.checkboxDisabled = false;
    }

    // Удаляем все лишние кнопки редактирования во всём DOM
    if (target.querySelectorAll('.form-item__edit-btn').length > 0) {
      target.querySelectorAll('.form-item__edit-btn').forEach((item: any) => item.remove())
    }

    // Переключаемся на режим просмотра
    this.usersCopy[i].itemVisible = false
  }

  // Метод обработки чекбокса
  checkInput(i: number): void {
    // Удаляем все кнопку редактирования
    const editContainer = document.querySelector('.form-item__edit');
    if (editContainer) editContainer.remove();

    // Удаляем лишний фон
    const contentContainer = document.querySelectorAll('.form-container__content');
    if (contentContainer) contentContainer[i].classList.remove('form-container__content_background');
  }

  // Обрабатываем поле телефона
  changePhone(value: string, input: any, i: number): void {
    // Ищем кнопку по ID
    let btnSave = document.getElementById(this.usersCopy[i].idBtn);

    // Если кнопка существует проводим валидацию
    if (btnSave !== null) {
      // Меняем стили и disabled по условию валидации
      if (value.length < 12 || value.length > 12) {
        this.usersCopy[i].validate.phoneValidate = true;
        this.renderer.setStyle(input, "background", "#FFE5E5");
      } else {
        this.usersCopy[i].validate.phoneValidate = false;
        this.renderer.setStyle(input, "background", "rgba(0, 128, 255, 0.1)");
      }
    }

    // Стилизация кнопки 'Сохранить' по условию
    if (this.usersCopy[i].validate.phoneValidate || this.usersCopy[i].validate.emailValidate || this.usersCopy[i].validate.nameValidate) {
      this.renderer.setStyle(btnSave, "background", "rgba(0, 128, 255, 0.3)")
    } else this.renderer.setStyle(btnSave, "background", "#0080FF");
  }

  changeAddPhone(value: string, input: any): void {
    let btnAddSave = document.querySelector('.form-item-add__btn-save');

    // Меняем стили и disabled по условию валидации
    if (value.length < 12 || value.length > 12) {
      this.phoneValid = true;
      this.renderer.setStyle(input, "background", "#FFE5E5");
    } else {
      this.phoneValid = false;
      this.renderer.setStyle(input, "background", "rgba(0, 128, 255, 0.1)");
    }

    // Стилизация кнопки 'Сохранить' по условию
    if (this.phoneValid || this.fullNameValid || this.emailValid) {
      this.renderer.setStyle(btnAddSave, "background", "rgba(0, 128, 255, 0.3)")
    } else this.renderer.setStyle(btnAddSave, "background", "#0080FF");
  }

  changeAddFullName(value: string, input: any): void {
    let btnAddSave = document.querySelector('.form-item-add__btn-save');

    if (value === '') {
      this.fullNameValid = true;
      this.renderer.setStyle(input, "background", "#FFE5E5");
    } else {
      this.fullNameValid = false;
      this.renderer.setStyle(input, "background", "rgba(0, 128, 255, 0.1)");
      this.renderer.setStyle(input, "background", "rgba(0, 128, 255, 0.1)");
    }

    // Стилизация кнопки 'Сохранить' по условию
    if (this.phoneValid || this.fullNameValid || this.emailValid) {
      this.renderer.setStyle(btnAddSave, "background", "rgba(0, 128, 255, 0.3)")
    } else this.renderer.setStyle(btnAddSave, "background", "#0080FF");

    this.userAddItem.name = this.addItemFullName.split(' ',2)[0];
    this.userAddItem.surname = this.addItemFullName.split(' ', 2)[1];
  }

  changeAddEmail(value: string, input: any): void {
    let btnAddSave = document.querySelector('.form-item-add__btn-save');
    let reg = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i;
    let result = reg.test(value);

    if (!result) {
      this.emailValid = true;
      this.renderer.setStyle(input, "background", "#FFE5E5");
    } else {
      this.emailValid = false;
      this.renderer.setStyle(input, "background", "rgba(0, 128, 255, 0.1)");
    }

    // Стилизация кнопки 'Сохранить' по условию
    if (this.phoneValid || this.fullNameValid || this.emailValid) {
      this.renderer.setStyle(btnAddSave, "background", "rgba(0, 128, 255, 0.3)")
    } else this.renderer.setStyle(btnAddSave, "background", "#0080FF");
  }

  changeFullName(value: string, input: any, i: number): void {
    let btnSave = document.getElementById(this.usersCopy[i].idBtn);

    // Если кнопка существует проводим валидацию
    if (btnSave !== null) {
      // Проверка на пустое поле
      if (value === '') {
        this.usersCopy[i].validate.emailValidate = true;
        this.renderer.setStyle(input, "background", "#FFE5E5");
      } else {
        this.usersCopy[i].validate.emailValidate = false;
        this.renderer.setStyle(input, "background", "rgba(0, 128, 255, 0.1)");
      }
    }

    // Стилизация кнопки 'Сохранить' по условию
    if (this.usersCopy[i].validate.phoneValidate || this.usersCopy[i].validate.emailValidate || this.usersCopy[i].validate.nameValidate) {
      this.renderer.setStyle(btnSave, "background", "rgba(0, 128, 255, 0.3)")
    } else this.renderer.setStyle(btnSave, "background", "#0080FF");
  }

  changeEmail(value: any, input: any, i: number): void {
    let btnSave = document.getElementById(this.usersCopy[i].idBtn);
    let reg = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i;
    let result = reg.test(value);

    // Если кнопка существует проводим валидацию
    if (btnSave !== null) {
      if (!result) {
        this.usersCopy[i].validate.emailValidate = true;
        this.renderer.setStyle(input, "background", "#FFE5E5");
      } else {
        this.usersCopy[i].validate.emailValidate = false;
        this.renderer.setStyle(input, "background", "rgba(0, 128, 255, 0.1)");
      }
    }

    // Стилизация кнопки 'Сохранить' по условию
    if (this.usersCopy[i].validate.phoneValidate || this.usersCopy[i].validate.emailValidate || this.usersCopy[i].validate.nameValidate) {
      this.renderer.setStyle(btnSave, "background", "rgba(0, 128, 255, 0.3)")
    } else this.renderer.setStyle(btnSave, "background", "#0080FF");
  }

  mouseLeave(event: any, i: number) {
    if (!this.usersCopy[i].checked) {
      let target = event.target;

      if (target.querySelectorAll('.form-item__edit').length > 0) {
        target.querySelector('.form-item__edit').remove();
      }
    }
  }

  deleteModal() {
    this.usersCopy.forEach(item => {
      if (item.checked) this.count++;
    })

    if (this.count > 0) {
      this.modalVisible = true;
    }
  }

  deleteUsers() {
    this.modalVisible = false;
    this.count = 0;

    this.allIdDelete.forEach(item => {
      this.httpService.deleteUsers(item).subscribe(response => this.ngOnInit())
    })

    this.allIdDelete = [];
  }

  resetCheck() {
    this.usersCopy.forEach(item => {
      item.checked = false;
    })

    this.allIdDelete = [];
  }

  delete() {
    if (this.allIdDelete.length > 0) {
      this.allIdDelete.forEach(item => {
        this.httpService.deleteUsers(item).subscribe(response => {
          this.ngOnInit()
          this.allIdDelete = [];
        })
      })
    }
  }

  check(user: any) {
    document.querySelectorAll('.form-item__edit').forEach((item: any) => item.remove());

    if (user.checked) {
      this.allIdDelete.push(user.id);
      if (this.allIdDelete.length > 1) {
        this.allIdDelete.forEach(item => {
          if (item === user.id) {
            const newSet = new Set(this.allIdDelete);
            this.allIdDelete = Array.from(newSet);
          }
        })
      }
    } else {
      this.allIdDelete.forEach((item, i) => {
        if (item === user.id) {
          this.allIdDelete.splice(i, 1)
        }
      })
    }
  }

  ngOnInit() {
    this.users$ = this.httpService.getUsers()

    this.users$.subscribe((data: any) => {
      this.usersCopy = data
      this.usersCopy.map(item => item.checked = false);
      this.usersCopy.map(item => item.itemVisible = false);
      this.usersCopy.map((item: any) => {
          let name = item.name;
          let surname = item.surname;
          delete item.name;
          delete item.surname;
          return item.fullName = name + ' ' + surname;
      })
    })
  }
}
