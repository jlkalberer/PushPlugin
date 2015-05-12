(function () {
    "use strict";

    var localSettings = Windows.Storage.ApplicationData.current.localSettings;
    var options = JSON.parse(localSettings["PushNotificationTask-config"]);
    importScripts(options.importScript);

    var backgroundTaskInstance = Windows.UI.WebUI.WebUIBackgroundTaskInstance.current;
    var canceled = false;

    function run() {

        var notificationDetails = backgroundTaskInstance.triggerDetails;

        if (!notificationDetails) {
            return;
        }

        window[options.callback](JSON.parse(notificationDetails.content));
        close();
    }

    function onCanceled(cancelSender, cancelReason) {
        canceled = true;
        close();
    }

    if (!canceled) {
        run();
    } else {
        //Must Call Close
        close();
    }

    //register event handlers
    backgroundTaskInstance.addEventListener("canceled", onCanceled);

})();