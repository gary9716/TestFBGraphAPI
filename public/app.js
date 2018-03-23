'use strict';
(function() {
    angular.module('mainApp',['ezfb'])
    .config(function (ezfbProvider) {
        ezfbProvider.setLocale('zh_TW');
        ezfbProvider.setInitParams({
            // This is my FB app id for plunker demo app
            appId: model.app_id,
        
            // Module default is `v2.6`.
            // If you want to use Facebook platform `v2.3`, you'll have to add the following parameter.
            // https://developers.facebook.com/docs/javascript/reference/FB.init
            version: model.api_version
        });  
    });
    
    angular.module('mainApp')
    .controller('FBTestController', ['$rootScope','$window', '$http','ezfb',
        function($rootScope, $window, $http, ezfb) {
            var ctrler = this;
            var passUserDataToServer = function(response) {
                if(response.authResponse) {
                    // Logged into your app and Facebook.
                    var userData = response.authResponse;
                    $http.post(model.target_route, userData)
                    .then(function(res) {
                        console.log('succeed to pass data');
                    })
                    .catch(function(err) {
                        console.log('failed to pass data,');
                        if(err)
                            console.log(err);
                    });
                    /*
                        authResponse: {
                            accessToken: '...',
                            expiresIn:'...',
                            signedRequest:'...',
                            userID:'...'
                        }
                        如果狀態是 connected，就會包含 authResponse，且由以下資料所構成：
                        accessToken - 含有這位應用程式用戶的存取權杖。
                        expiresIn - 以 UNIX 時間顯示權杖何時到期並需要再次更新。
                        signedRequest - 已簽署的參數，其中包含這位應用程式用戶的資訊。
                        userID - 這位應用程式用戶的編號。
                    */
                }
            };

            ctrler.fbBtnOnPress = function() {
                ezfb.getLoginStatus(function(response) {
                    if (response.status === 'connected') {
                        passUserDataToServer(response);
                    }
                    else { //ask user to login or rerequest permission
                        ezfb.login(passUserDataToServer, {
                            scope: model.fb_api_scope,
                            return_scopes: true,
                            auth_type: 'rerequest'
                        });
                    }
                });
 
            }
            
        }
    ]);

})();