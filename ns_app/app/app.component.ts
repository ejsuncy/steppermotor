import {Component} from "@angular/core";
import {MQTTClient} from 'nativescript-mqtt';
import {Message} from 'nativescript-mqtt/common';
import {LoadingIndicator} from 'nativescript-loading-indicator';

@Component({
    selector: "my-app",
    template: `
    <StackLayout>
        <ActionBar title="Motor Calibration" class="action-bar"></ActionBar>
        
        <Label text="Instructions"></Label>
        <Button text="Connect WS" (tap)="connect()"></Button>
        
        <TextView editable="false" text="1. Move the blinds to the closed position."></TextView>
        <TextView editable="false" text="2. Click this button to designate this position as 0%:"></TextView>
        <Button horizontalAlignment="center" text="Set 0%" (tap)="setMotor(1,0)"></Button>
        
        <TextView editable="false" text="3. Move the blinds to the open position."></TextView>
        <TextView editable="false" text="4. Click this button to designate this position as 100%."></TextView>
        <Button horizontalAlignment="center" text="Set 100%" (tap)="setMotor(1,100)"></Button>
        
    </StackLayout>
  `
})
export class AppComponent {
    mqtt_host: string = "broker.mqttdashboard.com";
    mqtt_port: number = 8000;
    mqtt_client: MQTTClient;
    mqtt_clientId: string = "clientId-PUhK0XepHR";
    mqtt_clientOptions: Object = {
        host: this.mqtt_host,
        port: this.mqtt_port,
        clientId: this.mqtt_clientId
    };
    mqtt_username: string = "";
    mqtt_password: string = "";
    mqtt_motor_topic: string = "set_motor";
    loadingIndicator: LoadingIndicator = new LoadingIndicator();

    constructor() {
        this.mqtt_client = new MQTTClient(this.mqtt_clientOptions);
        this.setupHandlers();
    }

    setupHandlers() {
        this.mqtt_client.onConnectionFailure.on(this.handleConnectionFailure);
        this.mqtt_client.onConnectionSuccess.on(this.handleConnectionSuccess);
        this.mqtt_client.onMessageArrived.on(this.handleMessageArrived);
        this.mqtt_client.onConnectionLost.on(this.handleConnectionLost);
    };

    handleConnectionFailure(data: string): void {
        console.log("Connection Failure: " + data);
        this.loadingIndicator.hide();
        alert("Connection Failure: " + data);
    }

    handleConnectionSuccess(): void {
        console.log("Connection success! Cool bro!");
        this.loadingIndicator.hide();
    }

    handleConnectionLost(data: string): void {
        console.log("Connection Lost: " + data);
    }

    handleMessageArrived(message: Message): void {
        console.log("Message arrived: " + message);
    }

    connect() {
        console.log("Connecting to MQTT websocket bridge...");
        this.loadingIndicator.show();
        this.mqtt_client.connect(this.mqtt_username, this.mqtt_password);

        // console.log("Subscribing to topics...");
        // this.mqtt_client.subscribe(this.mqtt_motor_topic);
    }

    setMotor(id: number, val: number) {
        console.log(`Setting motor ${id} to ${val}%...`);

        let message = {
            id: id,
            val: val
        };

        this.publish(this.mqtt_motor_topic, message);
    }

    publish(topic: string, message: Object) {
        let payloadString = JSON.stringify(message);

        let mqtt_message = new Message({
            payloadString: payloadString,
            destinationName: topic
        });

        this.mqtt_client.publish(mqtt_message);
    }
}
