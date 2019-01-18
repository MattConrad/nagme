import React from 'react';
import { TimerConstants } from '../timer';

const Nag = (props) => {

    const getMinutes = () => Math.floor(props.timerState.secondsLeft / 60);
    const getSeconds = () => props.timerState.secondsLeft % 60;
    const getTimeDisplay = () => ("00" + getMinutes()).slice(-2) + ":" + ("00" + getSeconds()).slice(-2);

    const renderWaiting = () => (
        <div>
            <div>COUNTING DOWN UNTIL WE NAG: {getTimeDisplay()}</div>
        </div>
    )

    const renderDidYouDoGood = () => (
        <div>MWCTODO: DID YOU DO GOOD?</div>
    )

    const renderPaused = () => (
        <div>MWCTODO: this is paused, but how did we get here exactly?</div>
    )

    const renderConditionally = () => {
        if (props.timerState.timerStatus === TimerConstants.RUNNING) {
            return renderWaiting();
        } else if (props.timerState.timerStatus === TimerConstants.EXPIRED) {
            return renderDidYouDoGood();
        } else if (props.timerState.timerStatus === TimerConstants.PAUSED) {
            return renderPaused();
        } else if (props.timerState.timerStatus === null) {
            return null;
        } else {
            throw Error("Invalid timerState in Nag.");
        }
    }

    return renderConditionally();
}

export default Nag;
