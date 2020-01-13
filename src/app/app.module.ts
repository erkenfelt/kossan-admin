import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material/material.module';

import { AppRoutingModule } from './routing/app-routing.module';

import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LoginComponent } from './auth/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';

import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { AdminGuard } from './auth/admin.guard';
import { AdminComponent } from './admin/admin.component';
import { FirebaseService } from './firebase/firebase.service';
import { AddAccountDialog } from './admin/add-account/add-account.dialog';
import { EditAccountDialog } from './admin/edit-account/edit-account.dialog';
import { AccountUsersDialog } from './admin/account-users/account-users.dialog';
import { AddParticipationDateDialog } from './admin/add-date/add-participation-date.dialog';
import { NewPasswordDialog } from './auth/new-password/new-password.dialog';
import { BookingPageComponent } from './dashboard/booking-page/booking-page.component';
import { AddMaintenanceDateDialog } from './admin/add-date/add-maintenance-date.dialog';
import { AddFixingDateDialog } from './admin/add-date/add-fixing-date.dialog';

const dialogs = [
  AccountUsersDialog,
  AddAccountDialog,
  AddFixingDateDialog,
  AddMaintenanceDateDialog,
  AddParticipationDateDialog,
  EditAccountDialog,
  NewPasswordDialog,
];

@NgModule({
  declarations: [
    AppComponent,

    AccountUsersDialog,
    AddAccountDialog,
    AddFixingDateDialog,
    AddMaintenanceDateDialog,
    AddParticipationDateDialog,
    AdminComponent,
    BookingPageComponent,
    DashboardComponent,
    EditAccountDialog,
    LayoutComponent,
    LoginComponent,
    NewPasswordDialog,
    ToolbarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,

    AppRoutingModule,
    MaterialModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  providers: [AuthService, AuthGuard, AdminGuard, FirebaseService],
  bootstrap: [AppComponent],
  entryComponents: [...dialogs]
})
export class AppModule { }
