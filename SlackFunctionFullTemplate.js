const TARGET_ENDPOINT = "https://api.slack.com/methods/chat.postMessage"; // need to create a channel //add in variable for channel URL 

export function handleEntityNotification (data: any) {

    const type = data.meta.eventType; // this is from the webhook
    if (type === "ENTITY_CREATED") {
        var accountId = data.meta.accountId;
        var entityId = data.entityId;
        var actorLabel = data.meta.actor;
        var entityUrl = "https://www.yext.com/s/3151361/entity/edit3?entityIds=" + data.primaryProfile.meta.uid;
        return createMessageHandler(accountId, entityId, actorLabel, entityUrl);
    } else if (type === "ENTITY_UPDATED") {
        var accountId = data.meta.accountId;
        var entityId = data.entityId;
        var actorLabel = data.meta.actor;
        var updatedFields = data.changedFields.fieldNames;
        var entityUrl = "https://www.yext.com/s/3151361/entity/edit3?entityIds=" + data.primaryProfile.meta.uid;
        return updateMessageHandler(accountId, entityId, actorLabel, updatedFields, entityUrl);
    } else if (type === "ENTITY_DELETED") {
        var accountId = data.meta.accountId;
        var entityId = data.entityId;
        var actorLabel = data.meta.actor;
        return deleteMessageHandler(accountId, entityId, actorLabel)
    }
    return null;
}

export function createMessageHandler(accountId: string, entityId: string, actorLabel: string, entityUrl: string) {
    var message = "A new entity was added to your Knowledge Graph by " + actorLabel + "!" + "\nAccount ID: " + accountId + ", Entity ID: " + entityId +  "\nSee the URL here: " + entityUrl;
    return postRequest(message);
}

export function updateMessageHandler(accountId: string, entityId: string, actorLabel: string, updatedFields:string, entityUrl: string) {
    var message = "An entity has been updated in your Knowledge Graph by " + actorLabel + "!" + "\nAccount ID: "+ accountId + ", Entity ID: " + entityId + "\nUpdated Field: " + updatedFields + "\nSee the URL here: " + entityUrl;
    return postRequest(message);
}

export function deleteMessageHandler(accountId: string, entityId: string, actorLabel: string) {
    var message = "An entity has been deleted from your Knowledge Graph! \nAccount ID: "+ accountId + ", Entity ID: " + entityId
    return postRequest(message);
}

export function postRequest(message: string){
    console.log("here")
    console.log(message)
    var payload = {text:message};
    //payload[field] = message;
    const request = new Request(TARGET_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      "content-type": "application/json",
    },
  });
    return fetch(request);
}