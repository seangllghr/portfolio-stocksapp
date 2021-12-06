import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { MenuButtonComponent } from './components/menu-button/menu-button.component';
import {
  faPlus,
  faTimes,
  faAngleDown,
  faAngleUp,
  faMinus,
  faRedo,
} from '@fortawesome/free-solid-svg-icons';
import { StocksComponent } from './components/stocks/stocks.component';
import { StocksItemComponent } from './components/stocks-item/stocks-item.component';
import { StockDetailComponent } from './components/stock-detail/stock-detail.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

const routes = [
  {
    path: '',
    component: WelcomeComponent,
  },
  {
    path: 'stock',
    children: [
      { path: ':Symbol', component: StockDetailComponent },
      { path: '', redirectTo: '/', pathMatch: 'full' },
    ],
  },
  {
    path: '404',
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: '/404',
  },
];

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    MenuButtonComponent,
    StocksComponent,
    StocksItemComponent,
    StockDetailComponent,
    WelcomeComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' }),
    HttpClientModule,
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faPlus, faTimes, faMinus, faRedo, faAngleUp, faAngleDown);
  }
}
