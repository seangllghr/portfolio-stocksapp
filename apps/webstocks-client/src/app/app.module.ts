import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { faPlus, faHome } from '@fortawesome/free-solid-svg-icons';
import { ListPanelComponent } from './components/layout/list-panel/list-panel.component';
import { MainPanelComponent } from './components/layout/main-panel/main-panel.component';
import { StocksComponent } from './components/stocks/stocks.component';
import { StocksItemComponent } from './components/stocks-item/stocks-item.component';
import { StockDetailComponent } from './components/stock-detail/stock-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ListPanelComponent,
    MainPanelComponent,
    StocksComponent,
    StocksItemComponent,
    StockDetailComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], { initialNavigation: 'enabledBlocking' }),
    HttpClientModule,
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faPlus, faHome);
  }
}
