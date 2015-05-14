var PushNotification = function() {
};

var callFunction = function (name, successCallback, errorCallback, args) {
    if (errorCallback == null) { errorCallback = function () {}; }

    if (typeof errorCallback != "function")  {
        console.log("PushNotification." + name +" failure: failure parameter not a function");
        return;
    }

    if (typeof successCallback != "function") {
        console.log("PushNotification." + name + " failure: success callback parameter must be a function");
        return;
    }

    cordova.exec(successCallback, errorCallback, "PushPlugin", name, args);
};


// Call this to register for push notifications. Content of [options] depends on whether we are working with APNS (iOS) or GCM (Android)
PushNotification.prototype.register = function(successCallback, errorCallback, options) {
    callFunction("register", successCallback, errorCallback, [options]);
};

// Call this to unregister for push notifications
PushNotification.prototype.unregister = function(successCallback, errorCallback, options) {
    callFunction("unregister", successCallback, errorCallback, [options]);
};

// Call this to register for push notifications. Content of [options] depends on whether we are working with APNS (iOS) or GCM (Android)
PushNotification.prototype.registerBackground = function(successCallback, errorCallback, options) {
    callFunction("registerBackground", successCallback, errorCallback, [options]);
};

// Call this to unregister for push notifications
PushNotification.prototype.unregisterBackground = function(successCallback, errorCallback, options) {
    callFunction("unregisterBackground", successCallback, errorCallback, [options]);
};

// Call this if you want to show toast notification on WP8
PushNotification.prototype.showToastNotification = function (successCallback, errorCallback, options) {
    callFunction("showToastNotification", successCallback, errorCallback, [options]);
};
// Call this to set the application icon badge
PushNotification.prototype.setApplicationIconBadgeNumber = function(successCallback, errorCallback, badge) {
    callFunction("setApplicationIconBadgeNumber", successCallback, errorCallback, [{badge: badge}]);
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