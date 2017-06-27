import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { AppRoutingModule } from "./app.routing";
import { AppComponent } from "./app.component";

import { ItemService } from "./item/item.service";
import { ItemsComponent } from "./item/items.component";
import { ItemDetailComponent } from "./item/item-detail.component";

@NgModule({
    bootstrap: [
        AppComponent // the entry point for our app
    ],
    imports: [ // this is where all the external @NgModules are brought in to our app for use
        NativeScriptModule,
        AppRoutingModule
    ],
    declarations: [ // this is where all declarables that we will use in our app go (components, directives, pipes)
        AppComponent,
        ItemsComponent,
        ItemDetailComponent
    ],
    providers: [ // provides application-level services that any component in our app can use
        ItemService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
