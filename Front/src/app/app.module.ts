import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/pages/login/login.component';
import { AprendizComponent } from './components/pages/administrativo/listagem-aprendiz/aprendiz.component';
import { GestoresComponent } from './components/pages/administrativo/listagem-gestor/gestores.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AdminComponent } from './components/pages/administrativo/admin/admin.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatIconModule } from '@angular/material/icon';
import { CadastroAprendizComponent } from './components/pages/administrativo/cadastro-aprendiz/cadastro-aprendiz.component';
import { CadastroGestorComponent } from './components/pages/administrativo/cadastro-gestor/cadastro-gestor.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AprendizComponent,
    GestoresComponent,
    SidebarComponent,
    AdminComponent,
    CadastroAprendizComponent,
    CadastroGestorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    FormsModule,
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
