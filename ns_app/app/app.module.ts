import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { AppComponent } from "./app.component";

@NgModule({
    bootstrap: [
        AppComponent // the entry point for our app
    ],
    imports: [ // this is where all the external @NgModules are brought in to our app for use
        NativeScriptModule
    ],
    declarations: [ // this is where all declarables that we will use in our app go (components, directives, pipes)
        AppComponent
    ],
    providers: [ // provides application-level services that any component in our app can use
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
