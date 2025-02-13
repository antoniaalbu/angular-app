import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { HomeComponent } from './app/pages/home/home.component';
import { AboutUsComponent } from './app/pages/about-us/about-us.component';
import { ServicesComponent } from './app/pages/services/services.component';
import { ContactComponent } from './app/pages/contact/contact.component';
import { AuthComponent } from './app/components/auth/auth.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { enviroment } from './app/enviroments/enviroment';
import { HomeAuthComponent } from './app/pages/home-auth/home-auth.component';
import { AuthGuard } from './app/guards/auth.guard';
import { PageNotFoundComponent } from './app/pages/page-not-found/page-not-found.component';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideDatabase, getDatabase } from '@angular/fire/database'; // 🔥 Import Realtime Database provider

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', component: HomeComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'home-auth', component: HomeAuthComponent, canActivate: [AuthGuard] },
  { path: '**', component: PageNotFoundComponent }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(enviroment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()), // 🔥 Add Realtime Database provider
  ],
}).catch(err => console.error(err));
