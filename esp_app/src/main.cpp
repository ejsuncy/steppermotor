#include <Arduino.h>
#include <AccelStepper.h>

const int MAX_SPEED = 900;
// defines pins numbers

/*
 *  This input turns on or off all of the FET outputs.
 *  When set to a logic high, the outputs are disabled.
 *  When set to a logic low, the internal control enables the outputs as required.
 *  The translator inputs STEP, DIR, and MSx, as well as the internal sequencing logic,
 *  all remain active, independent of the ENABLE input state.
 */
const int driverEnablePin = D3; // IO, 10k Pull-up; disabled outputs by default

/*
 * A low-to-high transition on the STEP input sequences the translator and advances the motor one increment
 */
const int stepPin = D8; // IO, 10k Pull-down, SS

/*
 * This determines the direction of rota- tion of the motor.
 * Changes to this input do not take effect until the next STEP rising edge.
 */
const int dirPin = D7; // D7

// create the stepper motor
AccelStepper stepper(1, stepPin, dirPin);

void setup() {
    // Sets the three pins as Outputs
    pinMode(driverEnablePin, OUTPUT);
    digitalWrite(driverEnablePin, LOW);

    pinMode(stepPin,OUTPUT);
    pinMode(dirPin,OUTPUT);

    pinMode(BUILTIN_LED, OUTPUT);
    digitalWrite(BUILTIN_LED, LOW);

    stepper.setMaxSpeed(MAX_SPEED);
    stepper.setSpeed(300);
}

void loop() {
    stepper.runSpeed();
}
