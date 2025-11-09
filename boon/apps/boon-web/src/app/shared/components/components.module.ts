import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FileSizePipe } from '@shared/pipes/fileSize.pipe';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [FileSizePipe],
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    InputTextModule,
    DialogModule,
    ButtonModule,
    CheckboxModule,
    TableModule,
    MultiSelectModule,
  ],
  exports: [FileSizePipe],
})
export class ComponentsModule {}
