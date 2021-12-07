import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import {
  faPlus,
  faTimes,
  faAngleDown,
  faAngleUp,
  faMinus,
  faRedo,
} from '@fortawesome/free-solid-svg-icons';

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
