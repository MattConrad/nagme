import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route } from 'react-router-dom';
import { Timer, TimerConstants } from './timer';
import Notifier from './notifier';
import Nag from './components/Nag';
import Tasks from './components/Tasks';

const Test = () => <div>TEST, ONLY A TEST</div>;

class App extends Component {
  constructor(props) {
    super(props);
    this.notifier = new Notifier(this.onNotificationsAllowedChange);
    this.timer = new Timer(this.onTimerTick, null);
    this.state = {
      currentTaskName: "nagme improvements",
      notificationsAllowed: this.notifier.allowed,
      lastTickTimerStatus: null,
      secondsLeft: 0
    };
  }
  
  onManageTasks = (history) => {
    // force the timer to pause if the timer is running. 
    if (this.timer.getStatus() === TimerConstants.RUNNING) this.timer.togglePause();

    console.log(this.props);

    history.push('/tasks');
  }

  onTaskCompleted = (taskSucceeded) => {
    const newTaskName = this.state.currentTaskName;
    this.setState({ currentTaskName: newTaskName });
    this.timer.completeTaskAndRestart(taskSucceeded);
  }

  onNotificationsAllowedChange = (notificationsAllowed) => {
    this.setState({ notificationsAllowed });
  }

  onTimerTick = (secondsLeft) => {
    const timerStatus = this.timer.getStatus();

    if (timerStatus === TimerConstants.EXPIRED && this.state.lastTickTimerStatus === TimerConstants.RUNNING) {
      this.notifier.invokeTimerExpired();
    }

    this.setState({ lastTickTimerStatus: timerStatus, secondsLeft });
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
              <Nag appState={this.state}
                manageTasks={this.onManageTasks}
                taskCompleted={this.onTaskCompleted}
                togglePause={this.timer.togglePause}
              />} />
            <Route path="/test" component={Test} />
            <Route path="/tasks" component={Tasks} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
