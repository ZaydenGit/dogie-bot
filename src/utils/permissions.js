import config from "../../config.json" with { type: "json" };

export function isElevated(userId) {
    return config.users.elevated.includes(userId) || config.users.owners.includes(userId);
}

export function isOwner(userId) {
    return config.users.owners.includes(userId);
}