import { Activity } from "../models/activity";

export function getWhen(post: Activity) {
    const then = new Date(post.createdAt);
    const now = new Date();
    let difference = Math.abs(now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24);

    if (Math.trunc(difference) < 1) {
        difference = difference * 24;
        if (Math.trunc(difference) < 1) {
            difference = difference * 60;

            if (Math.trunc(difference) < 1) {
                difference = difference * 60;

                if (Math.trunc(difference) < 10) {
                    return 'just now';
                }

                return Math.trunc(difference) + ' seconds ago';
            } else if (Math.trunc(difference) === 1) {
                return Math.trunc(difference) + ' minute ago';
            }

            return Math.trunc(difference) + ' minutes ago';
        } else if (Math.trunc(difference) === 1) {
            return Math.trunc(difference) + ' hour ago';
        }

        return Math.trunc(difference) + ' hours ago';
    } else if (Math.trunc(difference) === 1) {
        return Math.trunc(difference) + ' day ago';
    }

    return Math.trunc(difference) + ' days ago';
}