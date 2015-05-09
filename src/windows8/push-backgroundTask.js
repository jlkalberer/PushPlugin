(function () {
    "use strict";

    var backgroundTaskInstance = Windows.UI.WebUI.WebUIBackgroundTaskInstance.current;
    var canceled = false;

    function run() {
        //make awesome!!!
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