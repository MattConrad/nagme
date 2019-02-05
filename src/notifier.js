//https://developer.mozilla.org/en-US/docs/Web/API/notification


//MWCTODO: let's get some audio in here.

const Notifier = (callback) => {
    //possibly, we'll export this so it can be retried by the user.
    const requestNotificationPermission = () => {
        Notification.requestPermission().then((permission) => {
            visualNotifyAllowed = Notification.permission === "granted";

            callback(visualNotifyAllowed);
        });
    }

    let visualNotifyAllowed = false;

    if (!window.Notification) {
        alert('Notifications are not supported in your browser.'
            + '\n\nYou won\'t ever be able to turn notifications on.'
            + '\n\nThis will limit the usefulness of this application.');

        return { allowed: visualNotifyAllowed };
    }

    visualNotifyAllowed = Notification.permission === "granted";

    if (!visualNotifyAllowed) requestNotificationPermission();

    const invokeTimerExpired = () => {
        if (visualNotifyAllowed) {
            new Notification("MWCTODO: this be a notification. what can we do with these");
        }

        //ok, audio is a hassle. let's do something else for now.
        // const audio = new Audio("test.wav");
        // const playPromise = audio.play();

        // if (playPromise !== undefined) {
        //     playPromise.then(_ => {
        //         console.log('se worky');
        //     }).catch(error => {
        //         // Autoplay was prevented.
        //         // Show a "Play" button so that user can start playback.
        //         console.log('se NOT worky', error);
        //     });
        // }
    }

    return { allowed: visualNotifyAllowed, invokeTimerExpired };
}

export default Notifier;
