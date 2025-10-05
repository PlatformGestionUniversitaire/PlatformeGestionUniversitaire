import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// import { AppComponent } from './app.component';
// Update the path below if your AppComponent is located elsewhere, for example:
import { AppComponent } from '../../app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
// import { NotFoundComponent } from './components/not-found/not-found.component';
// Update the path below to the correct location of NotFoundComponent, for example:
// Update the path below to the correct location of NotFoundComponent
// Update the path below to the correct location of NotFoundComponent


// Define your routes
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // Add your dashboard component
// 404 page - must be last
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
   
  ],
  imports: [
	
    ReactiveFormsModule,
    RegisterComponent,
    BrowserModule,
    ReactiveFormsModule, // Required for Reactive Forms
    RouterModule.forRoot(routes) // Configure routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }