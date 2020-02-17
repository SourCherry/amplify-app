import { Component, OnInit } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { Character } from './model/Character';
import { OggDudeTransformer } from './model/OggDudeTransformer';
import { xml2js } from '../../node_modules/xml2js';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'amplify-app';
  private reader : FileReader = new FileReader();
  private showUpload : boolean = true;
  private characters: Observable<Character[]>;

  constructor() { }

  ngOnInit() {

    this.characters = new FileObservable(this.reader)
      .pipe(map((xml : string) => {
        var parseString = require('xml2js').parseString;
        let oggDude : any;

        const ignorePortrait = function (value, name) {
          //`name` will be the node name or attribute name
          //do something with `value`, (optionally) dependent on the node/attr name
          if(name == "Portrait") {
            return "";
          } else {
            return value;
          }
        }
        
        parseString(xml, {explicitArray : false, emptyTag : null, valueProcessors : [ignorePortrait]}, function (err, result) {
            if(err) {
              console.error(err);
              throw new Error(err);
            }            
            console.dir(result);
            oggDude = result;
        });
        return oggDude;
      }))
      .pipe(map((oggDude : any) => {
        const character : Character = OggDudeTransformer.to(oggDude);
        const characters : Character[] = new Array<Character>();
        characters.push(character);
        this.showUpload = false;
        return characters;        
      }));
  }

  uploadFile(event: Blob[]) {
    if (event.length == 0) return;
    const blob: Blob = event[0];
    this.reader.readAsText(blob);
  }
}

export class FileObservable extends Observable<string> {
  constructor (reader : FileReader) {
    super((s : Subscriber<any>) => {
      reader.onerror = e => s.error(e);
      reader.onabort = e => s.error(e);
      reader.onload = () => s.next(reader.result);
      reader.onloadend = () => s.complete;
    })
  }
}
