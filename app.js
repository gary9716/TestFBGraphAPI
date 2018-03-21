'use strict';
(function() {
    angular.module('mainApp',[]); //initialize app
    
    angular.module('mainApp')
    .controller('FBTestController', ['$window', '$http',
        function($window, $http) {
            var ctrler = this;

            ctrler.fbInit = function() {
                var FB_SDK_URL = "https://connect.facebook.net/zh_TW/sdk.js";
                var app_id = "222124558335828";
                var api_version = "2.12";

                $window.fbAsyncInit = function() {
                    FB.init({
                      appId      : app_id,
                      cookie     : true,
                      xfbml      : true,
                      version    : api_version
                    });
                      
                    FB.AppEvents.logPageView();   
                      
                  };
                
                  (function(d, s, id){
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) {return;}
                    js = d.createElement(s); js.id = id;
                    js.src = FB_SDK_URL;
                    fjs.parentNode.insertBefore(js, fjs);
                  }(document, 'script', 'facebook-jssdk'));
            }
            ctrler.checkAuth = function() {
                
                FB.getLoginStatus(function(response) {
                    var status = response.status;
                    if(status === "connected") {
                        var authRes = response.authResponse;
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
                    else {
                        //
                    }

                });
            }
        }
    ]);

})();