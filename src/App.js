import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { Timer, TimerConstants } from './timer';
import Notifier from './notifier';
import Nag from './components/nag';

const Test = () => <div>TEST, ONLY A TEST</div>;

class App extends Component {
  constructor(props) {
    super(props);
    this.notifier = new Notifier(this.onNotificationsAllowedChange);
    this.timer = new Timer(this.onTimerTick, null);
    this.state = {
      currentTaskName: "pointless endeavors",
      notificationsAllowed: this.notifier.allowed,
      timerStatus: null,
      secondsLeft: 0
    };
  }

  onTaskCompleted = (taskSucceeded) => {
    //MWCTODO: this should revise nagInterval according to adjustment rules.
    const newTaskName = this.state.currentTaskName + (taskSucceeded ? " YES" : " NO");
    this.setState({ currentTaskName: newTaskName });
    this.timer.restartNag();
  }

  onNotificationsAllowedChange = (notificationsAllowed) => {
    this.setState({ notificationsAllowed });
  }

  onTimerTick = (timerStatus, secondsLeft) => {
    if (timerStatus === TimerConstants.EXPIRED && this.state.timerStatus === TimerConstants.RUNNING) {
      this.notifier.sendTimerExpiredNotification();
    }

    this.setState({ timerStatus, secondsLeft });
  }

  renderNotificationsNotAllowedWarning() {
    if (this.state.notificationsAllowed) return null;

    return (
      <div>
        <div>Notifications are not enabled for this application (i.e. website).</div>
        <div>Enabling notifications will make your review reminders more noticeable.</div>
      </div>
    );
  };

  render() {
    return (
      <div className="App">
        {this.renderNotificationsNotAllowedWarning()}
        <BrowserRouter>
          <div>
            <Route path="/" exact render={() =>
              <Nag appState={this.state} taskCompleted={this.onTaskCompleted} togglePause={this.timer.togglePause} />} />
            <Route path="/test" component={Test} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
