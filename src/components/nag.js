import React from 'react';
import { TimerConstants } from '../timer';
import { withRouter } from 'react-router-dom';

const Nag = (props) => {

    const getMinutes = () => Math.floor(props.appState.secondsLeft / 60);
    const getSeconds = () => props.appState.secondsLeft % 60;
    const getTimeDisplay = () => ("00" + getMinutes()).slice(-2) + ":" + ("00" + getSeconds()).slice(-2);

    const renderCountdown = () => (
        <div>
            <div>counting down on {props.appState.currentTaskName}: {getTimeDisplay()}</div>
            <div>whoa whoa i need to pause! <input type="button" onClick={props.togglePause} value="pause" /></div>
            <div>i want to switch or manage tasks <input type="button" onClick={() => props.manageTasks(props.history)} value="change or manage tasks" /></div>
        </div>
    )

    //eventually, add more congratulations/denigrations for task completions.
    // probably, these will need to display in renderCountdown().
    // hooks will let us add state here which will make this easier/nicer.
    // let's see how soon hooks land in public React.
    // 
    const renderExpiredCountdown = () => (
        <div>
            <div>So you've been working on {props.appState.currentTaskName}.</div>
            <div>Have you done well?</div>
            {/* MWCTODO: fast clicking here can fire taskCompleted multiple times, not good. */}
            <div><input type="button" onClick={() => props.taskCompleted(true)} value="Yes" /><input type="button" onClick={() => props.taskCompleted(false)} value="No" /></div>
        </div>
    )

    const renderPaused = () => (
        <div>
            <div>Your task {props.appState.currentTaskName} is now paused. You may commence goofing off or going to the potty or whatever.</div>
            <div>I am done pausing, let's continue: <input type="button" onClick={props.togglePause} value="unpause" /></div>
            <div>i want to switch or manage tasks <input type="button" onClick={props.manageTasks} value="change or manage tasks" /></div>
        </div>
    )

    const renderConditionally = () => {
        if (props.appState.lastTickTimerStatus === TimerConstants.RUNNING) {
            return renderCountdown();
        } else if (props.appState.lastTickTimerStatus === TimerConstants.EXPIRED) {
            return renderExpiredCountdown();
        } else if (props.appState.lastTickTimerStatus === TimerConstants.PAUSED) {
            return renderPaused();
        } else if (props.appState.lastTickTimerStatus === null) {
            return null;
        } else {
            throw Error("Invalid appState in Nag.");
        }
    }

    return renderConditionally();
}

//we have to withRouter so we can receive the history to pass the history back up to the component it came from.
export default withRouter(Nag);
