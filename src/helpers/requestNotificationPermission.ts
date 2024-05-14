export default async function requestNotificationPermission() {
    const permission = await Notification.requestPermission();

    return permission;
}