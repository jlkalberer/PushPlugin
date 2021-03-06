﻿var pushNotificationTaskName = "PushNotificationTask";

var helpers = {
    registerBackgroundTask: function (options, success, fail) {
        Windows.ApplicationModel.Background.BackgroundExecutionManager.requestAccessAsync();

        var taskRegistered = false;

        var background = Windows.ApplicationModel.Background;
        var iter = background.BackgroundTaskRegistration.allTasks.first();
        var hascur = iter.hasCurrent;

        while (hascur) {
            var cur = iter.current.value;

            //if (cur.name === options.taskName) {
            //    taskRegistered = true;
            //    break;
            //}
            helpers.unregisterBackgroundTask(cur.name);

            hascur = iter.moveNext();
        }

        if (taskRegistered == true) {
            return iter.current;
        }


        var builder = new background.BackgroundTaskBuilder();
        builder.name = options.taskName;
        builder.taskEntryPoint = options.taskEntryPoint;
        var trigger = new background.PushNotificationTrigger();
        builder.setTrigger(trigger);
        builder.addCondition(
            new Windows.ApplicationModel.Background.SystemCondition(
                Windows.ApplicationModel.Background.SystemConditionType.internetAvailable));

        try {
            var task = builder.register();
            task.addEventListener("completed", success);

            var localSettings = Windows.Storage.ApplicationData.current.localSettings;
            localSettings["PushNotificationTask-config"] = JSON.stringify(options);

            WinJS.log && WinJS.log("Background task registered", "sample", "status");
        } catch (e) {
            WinJS.log && WinJS.log("Registration error: " + e.message, "sample", "error");
            fail(e);
            unregisterBackgroundTask();
        }

        return task;
    },
    unregisterBackgroundTask: function (taskName) {
        var background = Windows.ApplicationModel.Background;
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
};

module.exports = {
    register: function (success, fail, args) {
        try {
            var onNotificationReceived = window[args[0].ecb];

            Windows.Networking.PushNotifications.PushNotificationChannelManager.createPushNotificationChannelForApplicationAsync().then(
                function (channel) {
                    channel.addEventListener("pushnotificationreceived", function(response) {
                        onNotificationReceived(JSON.parse(response.rawNotification.content));
                    });
                    success(channel);
            }, fail);
        } catch(ex) {
            fail(ex);
        }
    },
    registerBackground: function (success, fail, args) {
        //TODO - Move this to a task which periodically re-registers the channel.
        Windows.Networking.PushNotifications.PushNotificationChannelManager.
            createPushNotificationChannelForApplicationAsync().then(function() {}, fail);

        helpers.registerBackgroundTask({
            taskName: pushNotificationTaskName,
            importScript: args[0].importScript,
            callback: args[0].ecb,
            taskEntryPoint: args[0].entryPoint || "www\\push-backgroundTask.js",
        }, success, fail);

    },
    unregisterBackground: function(success, fail, args) {
        if (helpers.unregisterBackgroundTask(pushNotificationTaskName)) {
            success();
            return;
        }

        fail();
    }
};
require("cordova/exec/proxy").add("PushPlugin", module.exports);
