import { NgModule } from '@angular/core';
import { TranslatePipe } from './translate.pipe';

@NgModule({
  declarations: [TranslatePipe],
  exports: [TranslatePipe]
})
export class PipesModule {}
