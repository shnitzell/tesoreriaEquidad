import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HeaderComponent } from './pages/shared/header/header.component';
import { FooterComponent } from './pages/shared/footer/footer.component';
import { SearchComponent } from './pages/search/search.component';
import { ResultadosFacturasComponent } from './pages/resultados-facturas/resultados-facturas.component';
import { SharingService } from '../services/sharing.service';
import { TransaccionComponent } from './pages/transaccion/transaccion.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SearchComponent,
    ResultadosFacturasComponent,
    TransaccionComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, NgbModule, FormsModule],
  providers: [SharingService, provideHttpClient()],
  bootstrap: [AppComponent],
})
export class AppModule {}
