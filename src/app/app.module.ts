import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule} from "@angular/forms";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {ColorPickerModule} from "ngx-color-picker";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    DragDropModule,
    ColorPickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
