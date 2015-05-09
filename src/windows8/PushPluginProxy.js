// Copyright (c) Microsoft Open Technologies, Inc.  Licensed under the MIT license. 

//
// Register a background task with the specified name and taskEntryPoint
//
// taskName: A name for the background task.
// taskEntryPoint: Task entry point for the background task.
//
function registerBackgroundTask(taskName, taskEntryPoint, success, fail) {
    Windows.ApplicationModel.Background.BackgroundExecutionManager.requestAccessAsync();

    var taskRegistered = false;

    var background = Windows.ApplicationModel.Background;
    var iter = background.BackgroundTaskRegistration.allTasks.first();
    var hascur = iter.hasCurrent;

    while (hascur) {
        var cur = iter.current.value;

        if (cur.name === taskName) {
            taskRegistered = true;
            break;
        }
        
        hascur = iter.moveNext();
    }

    if (taskRegistered == true) {
        return iter.current;
    }


    var builder = new background.BackgroundTaskBuilder();
    builder.Name = taskName;
    builder.TaskEntryPoint = taskEntryPoint;
    var trigger = new background.PushNotificationTrigger();
    builder.setTrigger(trigger);
    builder.addCondition(
        new Windows.ApplicationModel.Background.SystemCondition(
            Windows.ApplicationModel.Background.SystemConditionType.internetAvailable));

    try {
        var task = taskBuilder.register();
        task.addEventListener("completed", success);
        WinJS.log && WinJS.log("Background task registered", "sample", "status");
    } catch (e) {
        WinJS.log && WinJS.log("Registration error: " + e.message, "sample", "error");
        fail(e);
        unregisterBackgroundTask();
    }

    return task;
}

function unregisterBackgroundTask(taskName) {
    var iter = background.BackgroundTaskRegistration.allTasks.first();
    while (iter.hasCurrent) {
        var task = iter.current.value;
        if (task.name === taskName) {
            task.unregister(true);
            return true;
        }
        iter.moveNext();
    }
    return false;
}

module.exports = {
    register: function (success, fail, args) {
        try {
            var onNotificationReceived = window[args[0].ecb];

            Windows.Networking.PushNotifications.PushNotificationChannelManager.createPushNotificationChannelForApplicationAsync().then(
                function (channel) {
                    channel.addEventListener("pushnotificationreceived", onNotificationReceived);
                    success(channel);
            }, fail);
        } catch(ex) {
            fail(ex);
        }
    },
    registerBackground: function(sucess, fail, args) {
        registerBackgroundTask(args[0].name, args[0].callback, success, fail);
    },
    unregisterBackground: function(success, fail, args) {
        if (unregisterBackgroundTask(args[0].name)) {
            success();
            return;
        }

        fail();
    }
};
require("cordova/windows8/commandProxy").add("PushPlugin", module.exports);