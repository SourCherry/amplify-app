import { Injectable } from '@angular/core';

import { HttpClientModule, HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators/map';
import { ICharacter, IDicePool, Convert } from './model/ICharacter';
import { Character } from './model/Character';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  public getCharacter(): Observable<Character> {

    return this.http
      .get<Object>(`http://localhost:3000/character`)
      .pipe(map(r => {
        const s : string = JSON.stringify(r);
        console.log(s);
        return s;
      }))
      .pipe(map(r => Convert.toICharacter(r)))
      .pipe(map(r => Character.create(r)));
  }

}
