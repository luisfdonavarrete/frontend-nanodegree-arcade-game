'use strict';
/**
 * Represents a Finite State Machine.
 * @class FiniteStateMachine
 * @constructor
 */
function FiniteStateMachine() {
    this.states = {};
    this.currentState = "";
    this.previousState = "";
}

/**
 * Add a new state to the states variable.
 * @method addState
 * @param {string} stateName - The name of the state.
 * @param {object} stateObject - The instance of the state object.
 * @param {array} statesAllowed - Array of state names that are allowed to switch.
 */
FiniteStateMachine.prototype.addState = function (stateName, stateObject, statesAllowed) {
    this.states[stateName] = {
        "stateName": stateName,
        "stateObject": stateObject,
        "statesAllowed": statesAllowed
    };
};

/**
 * Set the current state
 * @method setState
 * @param {string} stateName - The name of the state to be set.
 */
FiniteStateMachine.prototype.setState = function (stateName) {
    if (this.currentState === "") {
        this.currentState = stateName;
        this.states[this.currentState].stateObject.enter();
    }
    else if (this.currenState === stateName) {
        console.log("the actor is already in this state");
        return;
    }
    else if (this.states[this.currentState].statesAllowed.indexOf(stateName) > -1) {
        this.states[this.currentState].stateObject.exit();
        this.previousState = this.currentState;
        this.currentState = stateName;
        this.states[this.currentState].stateObject.enter();
    }
    else {
        console.log("you are not allowed to switch to that " + stateName + "state being in " + this.currentState + "state");
    }
    this.states[this.currentState].stateObject.tick();
};

/**
 * Calls the update method of the current state.
 * @method update
 * @param {number} dt - time delta information.
 */
FiniteStateMachine.prototype.tick = function () {
    this.states[this.currentState].stateObject.tick();
};

module.exports = FiniteStateMachine;
