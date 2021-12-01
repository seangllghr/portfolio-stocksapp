import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faPlus, faHome } from '@fortawesome/free-solid-svg-icons';
import { ListPanelComponent } from './components/layout/list-panel/list-panel.component';
import { MainPanelComponent } from './components/layout/main-panel/main-panel.component';

@NgModule({
  declarations: [AppComponent, NavbarComponent, ListPanelComponent, MainPanelComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], { initialNavigation: 'enabledBlocking' }),
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faPlus, faHome);
  }
}
