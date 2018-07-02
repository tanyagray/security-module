import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthExpiredDialogComponent } from './auth-expired-dialog.component';
import { MatDialogModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
  ],
  declarations: [AuthExpiredDialogComponent],
  entryComponents: [AuthExpiredDialogComponent]
})
export class AuthExpiredDialogModule { }
