import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {iUsers} from "../interface/users.interface";

@Injectable()
export class HttpService {
  body: any = {
    name: "Алина",
    surname: "Сероус",
    email: "malexan21@mail.ru",
    phone: "+79050206950",
    checked: false
  }
  constructor(private http: HttpClient) {}
  getUsers() {
    return this.http.get<iUsers[]>('http://localhost:3000/users')
  }
  postUser(body: any) {
    body = JSON.stringify(body);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = { headers: headers };
    return this.http.post('http://localhost:3000/users', body, options)
  }

  deleteUsers(id: any) {
    return this.http.delete('http://localhost:3000/users/' + id);
  }

  putUsers(id: any, body: any) {
    body = JSON.stringify(body);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = { headers: headers };
    console.log('Success')

    return this.http.put('http://localhost:3000/users/' + id, body, options)
  }
}
