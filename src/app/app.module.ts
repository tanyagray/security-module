import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SecurityModule } from 'security';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SecurityModule.forRoot({ clientId: 'TinyOwl' })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
