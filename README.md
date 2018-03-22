# Setup
## setup an FB app for testing
1. Go to https://developers.facebook.com/apps/
2. Create a new app or use existing app.
3. Remember the app id of the app and Route to this URL
https://developers.facebook.com/apps/{app_id}/fb-login/quickstart/
with app_id filled in.
4. Choose 網站, name the application whatever you like and proceed.
5. Type https://localhost:8080 into 網站網址 and press the button to save the settings.
6. Go to https://developers.facebook.com/apps/{app_id}/settings/basic/ with the same app_id filled in.  
![basic_settings](https://github.com/gary9716/TestFBVideoUpload/blob/master/app_settings.PNG)
If you successfully set the 網站網址, you should be able to see the same URL in the image above.
Copy the app_id(應用程式編號) and secret_id(應用程式密鑰) to a text file since they'll be needed later on.

## install stunnel and setup reverse proxy
1. Go to https://www.stunnel.org/downloads.html and download the installer depending on your OS.
2. Install it and then run it.
3. click Configuration > Edit Configuration from menu.
4. copy the following lines and append them to the configuration file and save it.
```
[tls]
accept=0.0.0.0:8080
connect=127.0.0.1:3000
cert = stunnel.pem
```
5. click Configuration > Reload Configuration from menu.

## run the express server
1. open terminal and change working directory to current project directory by cd command.
2. type the following command to install dependencies.
```
npm install
```
3. type the following command to run the node server.
```
node server.js
```
4. for testing whether FB login feature works or not, one can access the following url https://localhost:8080/FBLoginTest
if all setup were correctly done, then it should look like the image below
![fb_login_test](https://github.com/gary9716/TestFBVideoUpload/blob/master/FBLoginTestView.PNG)
