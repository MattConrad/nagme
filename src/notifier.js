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

    const sendTimerExpiredNotification = () => {
        if (visualNotifyAllowed) {
            new Notification("MWCTODO: this be a notification. what can we do with these");
        }
    }

    return { allowed: visualNotifyAllowed, sendTimerExpiredNotification };
}

export default Notifier;
