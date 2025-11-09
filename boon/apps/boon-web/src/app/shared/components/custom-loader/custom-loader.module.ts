import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomLoaderComponent } from './custom-loader.component';
import { CustomLoaderService } from './custom-loader.service';

@NgModule({
  declarations: [CustomLoaderComponent],
  imports: [CommonModule],
  exports: [CustomLoaderComponent],
  providers: [CustomLoaderService],
})
export class CustomLoaderModule {}
