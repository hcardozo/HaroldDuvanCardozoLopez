import { Component } from '@angular/core';
import { Icons } from './modules/shared/enums/icons.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  icons = Icons;
  title = 'bank-project';
}
