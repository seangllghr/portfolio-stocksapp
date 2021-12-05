import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { faPlus, faHome, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ListPanelComponent } from './components/layout/list-panel/list-panel.component';
import { MainPanelComponent } from './components/layout/main-panel/main-panel.component';
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
      { path: '', redirectTo: '/', pathMatch: 'full' }
    ]
  },
  {
    path: '404',
    component: NotFoundComponent
  },
  {
    path: '**',
    redirectTo: '/404',
  }
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ListPanelComponent,
    MainPanelComponent,
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
    library.addIcons(faPlus, faTimes, faHome);
  }
}
