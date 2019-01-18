//https://developer.mozilla.org/en-US/docs/Web/API/notification

const Notifier = (callback) => {
    //possibly, we'll export this so it can be retried by the user.
    const requestNotificationPermission = () => {
        Notification.requestPermission().then((permission) => {
            allowed = Notification.permission === "granted";

            callback(allowed);
        });
    }

    let allowed = false;

    if (!window.Notification) {
        alert('Notifications are not supported in your browser.'
            + '\n\nYou won\'t ever be able to turn notifications on.'
            + '\n\nThis will limit the usefulness of this application.');

        return { allowed };
    }

    allowed = Notification.permission === "granted";

    if (!allowed) requestNotificationPermission();

    const sendTimerExpiredNotification = () => {
        if (!allowed) return;

        new Notification("MWCTODO: this be a notification. what can we do with these");
    }

    return { allowed, sendTimerExpiredNotification };
}

export default Notifier;
