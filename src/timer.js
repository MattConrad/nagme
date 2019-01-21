/*
every 1.1 seconds we check to see if the nagInterval has expired. (presently nI is 30s, but normally 20min)

if it has, we change the status to 'expired' which will be observed by the nag component.

we need to expose methods for pausing the timer.

possibly we wrap all this up into a class/function like the Timer example below.

aw, shit, inactive tabs get lowered priority and timers may not work correctly. 
well, someone says timers fire at most 1x/sec which is good enough for us IF we get at least that much.
check these out if this proves to be a problem, though.  
    https://github.com/myonov/momentum
    https://www.npmjs.com/package/worker-interval
    https://stackoverflow.com/questions/32390789/how-to-make-javascript-run-at-normal-speed-in-chrome-even-when-tab-is-not-active#comment85520274_32390789
    http://github.com/turuslan/HackTimer
*/

const TimerConstants = {
    RUNNING: "running",
    PAUSED: "paused",
    EXPIRED: "expired"
}

/*
    callback should accept parameters: status, secondsLeft
*/
const Timer = (callback, config) => {
    const nagInterval = .55 * 60 * 1000;  //20 * 60 * 1000;

    //they say timers won't fire faster than about 1x/sec on inactive browser tabs anyway.
    const tickInterval = 1.1 * 1000;

    let nagTimeStart = new Date().valueOf();
    let pauseTimeStart = 0;
    let expiredTimeStart = 0;

    //running, paused, expired.
    let status = TimerConstants.RUNNING;

    const processTick = () => {
        const now = new Date().valueOf();

        if (status === TimerConstants.RUNNING) {
            if (now >= nagTimeStart + nagInterval) {
                expiredTimeStart = now;
                status = TimerConstants.EXPIRED;
            }
        }

        callback(status, getTimerSeconds(now));
    }

    const getTimerSeconds = (now) => {
        //later, we may want to introduce secondsElapsed along with secondsLeft for paused/expired states.
        if (status !== TimerConstants.RUNNING) return 0;

        return Math.round((nagTimeStart + nagInterval - now) / 1000);
    }

    const restartNag = () => {
        nagTimeStart = new Date().valueOf();
        pauseTimeStart = 0;
        expiredTimeStart = 0;
        status = TimerConstants.RUNNING;
    }

    const togglePause = () => {
        if (status === TimerConstants.EXPIRED) throw Error("Cannot toggle pause on an expired timer.");

        if (status === TimerConstants.PAUSED) {
            if (pauseTimeStart === 0) throw Error("Cannot unpause a timer without a pause time start.");

            const now = new Date().valueOf();
            const nagDuration = pauseTimeStart - nagTimeStart;

            nagTimeStart = new Date(now - nagDuration).valueOf();
            pauseTimeStart = 0;

            status = TimerConstants.RUNNING;
        } else if (status === TimerConstants.RUNNING) {
            pauseTimeStart = new Date().valueOf();
            status = TimerConstants.PAUSED;
        } else {
            throw Error(`Invalid timer status ${status}, cannot toggle pause.`);
        }
    }

    //once started, this timer continues forever. we don't need to keep timerId.
    window.setInterval(processTick, tickInterval);

    return { restartNag, togglePause };
}

export { Timer, TimerConstants };
