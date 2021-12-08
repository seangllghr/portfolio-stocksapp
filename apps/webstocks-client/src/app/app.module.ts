import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import {
  faPlus,
  faTimes,
  faAngleDown,
  faAngleUp,
  faMinus,
  faRedo,
} from '@fortawesome/free-solid-svg-icons';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AddStockComponent } from './components/add-stock/add-stock.component';
import { MenuComponent } from './components/menu/menu.component';
import { MenuButtonComponent } from './components/menu-button/menu-button.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { StocksComponent } from './components/stocks/stocks.component';
import { StocksItemComponent } from './components/stocks-item/stocks-item.component';
import { StockDetailComponent } from './components/stock-detail/stock-detail.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

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
    path: 'add',
    component: AddStockComponent,
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
    AddStockComponent,
    MenuComponent,
    MenuButtonComponent,
    NotFoundComponent,
    StocksComponent,
    StocksItemComponent,
    StockDetailComponent,
    WelcomeComponent,
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    HttpClientModule,
    RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faPlus, faTimes, faMinus, faRedo, faAngleUp, faAngleDown);
  }
}
