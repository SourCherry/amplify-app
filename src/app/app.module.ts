import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
import { FormsModule } from '@angular/forms';
import { OggdudeUploadDirective } from './upload/oggdude-upload.directive';

@NgModule({
  declarations: [
    AppComponent,
    OggdudeUploadDirective
  ],
  imports: [
    AmplifyAngularModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule
  ],
  providers: [
    AmplifyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
