
// Using the chance.js library to create random message strings
//
//declare var Chance: any;

export enum NotificationType {
    Comment = 0,
    Alert = 1,
    Code = 2,
    Payment = 3
}

export class Notification {
    notificationID: number;
    type: NotificationType;
    pageURL: string;
    message: string;
    seen: boolean;

    constructor(notificationID: number, message: string, seen: boolean, pageURL: string) {
        this.notificationID = notificationID;
        this.message = message;
        this.seen = seen;
        this.pageURL = pageURL;
    }
}