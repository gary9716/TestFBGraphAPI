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

# 關於在FB APP上申請投稿權限（publish_actions）的步驟
文章來源:https://marunouchi-tech.i-studio.co.jp/3618/
簡單做個翻譯  
--
前提條件
1. 擁有FB帳號
2. 登錄完FB開發者資格

申請手續(大略的說明)
1. 開好新的FB APP
2. 填入必要事項
3. 完成導入FB API的應用內容（※做好可以確認動作的東西）
4. 準備好實際應用的動畫，向應用審查提出申請
5. 等待數日
6. 如果被FB承認的話 就可以作為公開模式的APP使用

## 1. 開好新的FB APP
![image1](https://marunouchi-tech.i-studio.co.jp/wp-content/uploads/2017/03/blog01-300x162.png)  
從FacebookıDevelopers右上角的「我的應用」選擇「追加新的應用程式」
開新的APP的視窗中 填入應用程式名稱 聯絡人email地址 然後選擇類別

## 2. 填入必要事項
![image2](https://marunouchi-tech.i-studio.co.jp/wp-content/uploads/2017/03/blog2-300x186.png)  
選擇「基礎設定」→ 輸入「隱私權政策的URL」、設定「應用程式圖示」

選擇在「基礎設定」頁面下面的「追加平台」→ 選擇「網站」→ 輸入「網站URL」  

![image2.5](https://github.com/gary9716/TestFBVideoUpload/blob/master/add_scope_item.PNG)  
選擇「應用程式審查」→ 點選 提交項目以進行批准的「開始提交」→在「publish_actions」打勾後 點選「Add 1 item」

## 3. 完成導入FB API的應用內容（※做好可以確認動作的東西）
在應用裡設定「APP ID」和「app secret」的時候、選擇「基礎設定」→ 即可找到「APP ID」和「app secret」的資訊來利用

## 4. 上傳實際應用的動畫，向應用審查提出申請
![image4](https://marunouchi-tech.i-studio.co.jp/wp-content/uploads/2017/03/blog03-300x114.png)  
選擇「應用審查」→ 選擇當前申請欄位中的「publish_actions」的「編輯note」、從上面照順序打勾下來 把動畫上傳後 選擇Save
選擇「應用審查」頁面的當前申請欄位中的「申請應用審查」的「觀看note」、填入用來審查的測試使用者（※1）名
※1.登錄測試使用者的方法是「角色」→選擇「追加tester」、不用登錄也可預先利用「Open Graph Test User」
選擇「應用審查」頁面的當前申請欄位中的「提交審查」

## 5. 等待數日

雖說狀況可能有誤差，我兩個工作日就收到聯絡了

## 6. 如果被FB承認的話 就可以作為公開模式的APP使用
![image6](https://marunouchi-tech.i-studio.co.jp/wp-content/uploads/2017/03/blog04-300x48.png)  
選擇「應用審查」→ 要公開◯◯◯（應用程式名）嗎？這樣的欄位裡把「不」變成「是」