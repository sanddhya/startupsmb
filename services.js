startupSmb.factory('serviceForApiCall', ['$http', function ($http) {
    return {
        signUp: function (data) {
            return $http.post('https://smbstartuppack-dot-datatest-148118.appspot.com/smb/registeruser', data);
        },

        login: function (data) {
            return $http.post('https://smbstartuppack-dot-datatest-148118.appspot.com/smb/login', data);
        },

        sendPageLoadedEvent: function (id, campaign) {
            return $http.get('https://ad-tracker-standard-dot-datatest-148118.appspot.com/developer?idx=' + id + ' &event=landed&campaign=' + campaign);
        }
    }
}]);