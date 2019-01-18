import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { Timer, TimerConstants } from './timer';
import Notifier from './notifier';
import Nag from './components/nag';

const Test = () => <div>TEST, ONLY A TEST</div>;

//MWCTODO: the actual OS notification needs to happen here,
// because we need to compare previous state to new state to decide that
// we need to send the notification. Nag.js is stateless and can't tell.

class App extends Component {
  constructor(props) {
    super(props);
    this.notifier = new Notifier(null);
    this.timer = new Timer(this.onTimerTick, null);
    this.state = {
      notificationsAllowed: this.notifier.allowed,
      timerStatus: null,
      secondsLeft: 0
    };
  }

  onNotificationsAllowedChange(notificationsAllowed) {
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
      <div>MWCTODO: AW SHIT IF YOU DON'T ALLOW NOTIFICATIONS THIS IS GOING TO SUCK</div>
    );
  };

  render() {
    return (
      <div className="App">
        {this.renderNotificationsNotAllowedWarning()}
        <BrowserRouter>
          <div>
            <Route path="/" exact render={() => <Nag timerState={this.state} togglePause={this.timer.togglePause} />} />
            <Route path="/test" component={Test} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
