import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericInputComponent } from './components/generic-input/generic-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SvgIconComponent } from './components/svg-icon/svg-icon.component';
import { AlertComponent } from './components/alert/alert.component';



@NgModule({
  declarations: [
    GenericInputComponent,
    SvgIconComponent,
    AlertComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    GenericInputComponent,
    SvgIconComponent,
    AlertComponent
  ]
})
export class SharedModule { }
