import {Component, NgZone, OnInit} from "@angular/core";
import {MQTTClient, ClientOptions } from 'nativescript-mqtt';
import {Message} from 'nativescript-mqtt/common';
import {Subject} from "rxjs/Subject";
import {Subscriber} from "rxjs/Subscriber";
import {Subscription} from "rxjs/Subscription";

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
    // mqtt configuration
    private mqtt_host: string = "10.1.11.84";
    private mqtt_port: number = 11883;
    private mqtt_useSSL: boolean = false;
    private mqtt_path: string = "";
    private mqtt_username: string = "";
    private mqtt_password: string = "";
    private mqtt_topic: string = "angular-utah-demo";
    private mqtt_clientOptions: ClientOptions = {
        host: this.mqtt_host,
        port: this.mqtt_port,
        useSSL: this.mqtt_useSSL,
        path: this.mqtt_path
    };
    private mqtt_client: MQTTClient = new MQTTClient(this.mqtt_clientOptions);

    // mqtt message observable config
    messages: Subject<string[]>;  // for manually triggering the next() function; the UI async pipe subscribes/unsubscribes to this automagically
    logger: Subscriber<any>; // a manual observer for logging events to the console
    messages_model: string[] = [];  // the messages model that will be changed and emitted from the observable
    message_subscriptions: Subscription[] = []; // for keeping track of our manual subscriptions and eventually unsubscribing

    // local vars
    loading: Subject<boolean>;
    connected: Subject<boolean>;

    constructor(private _ngZone : NgZone) {
        console.log("Constructor triggered");
    }

    ngOnInit() : void {
        this.createManualObservables();
        this.subscribeToObservables();
        this.setupHandlers();
    }

    createManualObservables() : void {
        // create an observer
        this.logger = new Subscriber<any>(
            (loggable : any) => console.log(loggable),
            error => console.log(error),
            () => console.log("closed!!!!")
        );

        // create a Subject
        this.messages = new Subject();

        // create the loading indicator observable
        this.loading = new Subject();

        // create the connected indicator observable
        this.connected = new Subject();
    }

    subscribeToObservables() : void {
        // subscribe the logger manually to the observable
        this.message_subscriptions.unshift(
            this.messages.subscribe(this.logger)
        );

        this.loading.subscribe(this.logger);
        this.connected.subscribe(this.logger);
    }

    unsubscribeFromObservables() : void {
        this.message_subscriptions.forEach(subscriber => subscriber.unsubscribe());
        this.loading.unsubscribe();
    }

    triggerAsyncLoading(val : boolean) : void {
        this._ngZone.run(() => this.loading.next(val));
    }

    triggerAsyncConnected(val : boolean) : void {
        this._ngZone.run(() => this.connected.next(val));
    }

    triggerAsyncMessages(val : string[]) : void {
        this._ngZone.run(() => this.messages.next(val));
    }

    addMessage(): void {
        let message : string = "message " + (this.messages_model.length + 1);
        this.messages_model.unshift(message);
        this.messages.next(this.messages_model);
    }

    connect(): void {
        try {
            if (!this.mqtt_client.connected) {
                this.loading.next(true);
                console.log("connecting....");
                this.mqtt_client.connect(this.mqtt_username, this.mqtt_password);
            }
        }
        catch (e) {
            console.log("Caught Error: " + e);
        }
    }

    disconnect():void {
        this.triggerAsyncLoading(false);
        this.triggerAsyncConnected(false);
    }

    setupHandlers(): void {
        this.mqtt_client.onConnectionFailure.on((err) => {
            this.triggerAsyncLoading(false);
            this.triggerAsyncConnected(false);
            this.unsubscribeFromObservables();
            console.log("Connection failed: " + err);
        });

        this.mqtt_client.onConnectionSuccess.on(() => {
            console.log("connected!!");

            // subscribe to observables --> connect all the pipes!
            this.subscribeToObservables();

            // subscribe to the mqtt topic --> turn on the valve!
            this.subscribeToMQTT();

            this.triggerAsyncConnected(true);
            this.triggerAsyncLoading(false);
        });

        this.mqtt_client.onConnectionLost.on((err) => {
            this.disconnect();
            console.log("Connection lost  : " + err);
        });

        this.mqtt_client.onMessageArrived.on((message: Message) => {
            this.messages_model.unshift(message.payload);
            this.triggerAsyncMessages(this.messages_model);
        });
    }

    subscribeToMQTT(): void {
        try {
            console.log("Subscribing to topic: " + this.mqtt_topic);
            this.mqtt_client.subscribe(this.mqtt_topic);
        }
        catch (e) {
            console.log("Caught error: " + e);
        }
    }
}
