import { NativeDateAdapter } from '@angular/material';
import { Injectable } from '@angular/core';
import { Platform } from '@angular/cdk/platform';

@Injectable()
export class SwedishDateAdapter extends NativeDateAdapter {
  constructor() {
    super('sv-SE', new Platform());
  }

  getFirstDayOfWeek(): number {
    return 1;
  }
}
