var PushNotification = function() {
};

var checkCallbacks = function (name, successCallback, errorCallback) {
    if (errorCallback == null) { errorCallback = function () {}; }

    if (typeof errorCallback != "function")  {
        console.log("PushNotification." + name +" failure: failure parameter not a function");
        return false;
    }

    if (typeof successCallback != "function") {
        console.log("PushNotification." + name + " failure: success callback parameter must be a function");
        return false;
    }

    return true;
};


// Call this to register for push notifications. Content of [options] depends on whether we are working with APNS (iOS) or GCM (Android)
PushNotification.prototype.register = function(successCallback, errorCallback, options) {
    if (!checkCallbacks("register", successCallback, errorCallback)) {
        return;
    }

    cordova.exec(successCallback, errorCallback, "PushPlugin", "register", [options]);
};

// Call this to unregister for push notifications
PushNotification.prototype.unregister = function(successCallback, errorCallback, options) {
    if (!checkCallbacks("unregister", successCallback, errorCallback)) {
        return;
    }

    cordova.exec(successCallback, errorCallback, "PushPlugin", "unregister", [options]);
};

// Call this to register for push notifications. Content of [options] depends on whether we are working with APNS (iOS) or GCM (Android)
PushNotification.prototype.registerBackground = function(successCallback, errorCallback, options) {
    if (!checkCallbacks("registerBackground", successCallback, errorCallback)) {
        return;
    }

    cordova.exec(successCallback, errorCallback, "PushPlugin", "registerBackground", [options]);
};

// Call this to unregister for push notifications
PushNotification.prototype.unregisterBackground = function(successCallback, errorCallback, options) {
    if (!checkCallbacks("unregisterBackground", successCallback, errorCallback)) {
        return;
    }

    cordova.exec(successCallback, errorCallback, "PushPlugin", "unregister", [options]);
};

// Call this if you want to show toast notification on WP8
PushNotification.prototype.showToastNotification = function (successCallback, errorCallback, options) {
    if (!checkCallbacks("showToastNotification", successCallback, errorCallback)) {
        return;
    }

    cordova.exec(successCallback, errorCallback, "PushPlugin", "showToastNotification", [options]);
};
// Call this to set the application icon badge
PushNotification.prototype.setApplicationIconBadgeNumber = function(successCallback, errorCallback, badge) {
    if (!checkCallbacks("setApplicationIconBadgeNumber", successCallback, errorCallback)) {
        return;
    }
    
    cordova.exec(successCallback, errorCallback, "PushPlugin", "setApplicationIconBadgeNumber", [{badge: badge}]);
};

//-------------------------------------------------------------------

if(!window.plugins) {
    window.plugins = {};
}
if (!window.plugins.pushNotification) {
    window.plugins.pushNotification = new PushNotification();
}

if (typeof module != 'undefined' && module.exports) {
  module.exports = PushNotification;
}