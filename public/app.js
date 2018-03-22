'use strict';
(function() {
    angular.module('mainApp',[]); //initialize app
    
    angular.module('mainApp')
    .controller('FBTestController', ['$window', '$http',
        function($window, $http) {
            var ctrler = this;
            ctrler.hasLoggedIn = false;
            ctrler.fbBtnLabel = 'Login';
            ctrler.setFBBtn = function() {
                if(ctrler.hasLoggedIn) {
                    ctrler.fbBtnLabel = 'Logout';
                }
                else {
                    ctrler.fbBtnLabel = 'Login';
                }
            }

            // This is called with the results from from FB.getLoginStatus().
            ctrler.statusChangeCallback = function (response) {
                console.log('statusChangeCallback');
                console.log(response);
                
                // The response object is returned with a status field that lets the
                // app know the current login status of the person.
                // Full docs on the response object can be found in the documentation
                // for FB.getLoginStatus().

                if (response.status === 'connected') {
                    ctrler.hasLoggedIn = true;
                    
                    // Logged into your app and Facebook.
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

                    ctrler.authStatus = 'Thanks for logging in, ' + response.name + '!';
                }
                else {
                    ctrler.hasLoggedIn = false;
                    ctrler.authStatus = 'Please log in';
                }

                ctrler.setFBBtn();
            }

            ctrler.fbInit = function() {
                
                $window.fbAsyncInit = function() {
                    FB.init({
                        appId      : model.app_id, // pass in app_id at server side
                        cookie     : true,  // enable cookies to allow the server to access 
                                            // the session
                        xfbml      : true,  // parse social plugins on this page
                        version    : model.api_version // decide api version at server side
                    });

                    // Now that we've initialized the JavaScript SDK, we call 
                    // FB.getLoginStatus().  This function gets the state of the
                    // person visiting this page and can return one of three states to
                    // the callback you provide.  They can be:
                    //
                    // 1. Logged into your app ('connected')
                    // 2. Logged into Facebook, but not your app ('not_authorized')
                    // 3. Not logged into Facebook and can't tell if they are logged into
                    //    your app or not.
                    //
                    // These three cases are handled in the callback function.

                    //ref: https://developers.facebook.com/docs/reference/javascript/FB.Event.subscribe/v2.12
                    //passed as callbacks in login and logout function calls
//                    FB.Event.subscribe('auth.login', ctrler.statusChangeCallback); 
//                    FB.Event.subscribe('auth.logout', ctrler.statusChangeCallback);

                    FB.getLoginStatus(ctrler.statusChangeCallback);
                };

                // Load the SDK asynchronously
                (function(d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) return;
                    js = d.createElement(s); js.id = id;
                    js.src = "https://connect.facebook.net/zh_TW/sdk.js";
                    fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script', 'facebook-jssdk'));

            }

            ctrler.fbBtnOnPress = function() {
                if(ctrler.hasLoggedIn) {
                    FB.login(ctrler.statusChangeCallback, {
                        scope: 'publish_actions', 
                        return_scopes: true, //When true, the granted scopes will be returned in a comma-separated list in the grantedScopes field of the authResponse
                        auth_type: 'rerequest', //rerequest permissions.
                    });
                }
                else {
                    FB.logout(ctrler.statusChangeCallback);
                }
            }
            
        }
    ]);

})();