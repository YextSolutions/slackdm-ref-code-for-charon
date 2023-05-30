const TARGET_ENDPOINT = "https://api.slack.com/methods/chat.postMessage"; // This endpoint will change depending on how Charon sets up the app

// Below code will need to be updated. Included here to show intended structure of the function.  
export function handleEntityNotification (data: any) {

    const type = data.meta.eventType; // This is from the webhook
    const entityType = data.primaryProfile.meta.entityType; 
    if (type === "ENTITY_UPDATED" && (entityType === "ce_referral")) {
        var candidateName = response.entities.name; // First and Last name of candidate. Will pass in Slakc messages to referrers. 
        var referrerEmail = response.entities.c_referralEmailAddress;// Add streams value for referrer email -- add logic to grab the one that ends in @yext.com
        var referrerFirstName = response.entities.c_yexterWhoReferredThisPerson.firstName; // Pull first name of referrer to use when addressing in Slack message. 
        var referralJob = response.entities.c_referralJob.name; // Pull name of Job linked entity that the candidate was referred for. 
        var newStatus = response.entities.c_referralStatus; // This path should be the field value of c_referralStatus (In Review, Offer, Hired, Rejected). This will be used to determine the body text to send in the message below. 
        return updateMessageHandler(candidateName, referrerEmail, referrerFirstName, referralJob, newStatus);
    }
    return null;
}

// Make a call to https://api.slack.com/methods/users.lookupByEmail to find the “user_id” in Slack that matches the email address from Yext (referrerEmail)

export function updateMessageHandler(entityId: string, actorLabel: string, updatedFields:string) {
    var message = "Hi " + referrerFirstName + ", " +  "\nYour referral for " + candidateName + "has been updated." + "\nReferral stage has been changed to: " + newStatus; //Edit this with language for each referral status change - different language for each
    return postRequest(message);
}

// Update below code to Post a message to the user who referred the candidate using chat.postMessage (Endpoint: https://api.slack.com/methods/chat.postMessage) 
// Pass Slack user_id pulled in call above to determine who to send the message to. Message body will include candidateName, referrerFirstName, referralJob, and newStatus vars above). Baked into message text in appendix depending on which the status the candidate has been updated to.
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
