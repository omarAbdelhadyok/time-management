import { NgModule } from "@angular/core";
import { LayoutModule } from '@angular/cdk/layout';
import { 
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatCardModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule
} from '@angular/material';

const modules = [
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    LayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule
]

@NgModule({
    imports: [...modules],
    exports: [...modules]
})
export class MaterialImportsModule {}