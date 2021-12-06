import { Component } from '@angular/core';
import { UiService } from './services/ui-service.service';

@Component({
  selector: 'webstocks-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {
  title: string
  constructor(private uiService: UiService) {
    this.title = this.uiService.appMainTitle
  }
}
