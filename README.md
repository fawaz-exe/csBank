# csBank

## 📌 Description :
CS-Bank is a banking web application that demonstrates basic banking features.
Users can register, log in, deposit money, transfer funds, and view a sample debit card interface.

This project was built as part of a Full Stack Web Development, Software Engineering program at "The Hacking School" to practice frontend development, backend logic, and database integration.


## Features :
- Registration and Authentication
- Deposit, Transfer, and Withdrawal Money
- Mock Debit Card UI with show/hide card details 


## 🛠️ Tech Stack

### Frontend: 
- HTML, CSS, JavaScript, Bootstrap
### Backend: 
- Node.js, Express, MongoDB
### Tools: 
- Git, GitHub, VS Code, Postman, MongoDB Compass, Resend, Twilio

## ⚙️ Installation 

Follow the below steps to clone the repository and run the project locally

1. Clone the Repository :

`git clone git@github.com:fawaz-exe/csBank.git`

2. Navigate to the project directory :

`cd csBank`

3. Navigate to server folder :

`cd server`


4. Install the below packages :

- npm init -y 

- npm install express

- npm i cors

- npm i express-validator

- npm install resend 

- npm i dotenv

- npm i nodemon --save-dev
 
- npm install mongoose 

- npm install jsonwebtoken

- npm install twilio

5. Open package.json file and add the below lines :

  ` "type": "module", `
  
<img width="624" height="396" alt="01-package" src="https://github.com/user-attachments/assets/c7255c6f-ea73-4390-97cd-c66fc24586fa" />

6. Inside package.json also add the below line in scripts object  

   ` "server": "nodemon server.js" `
   
<img width="541" height="305" alt="02-package" src="https://github.com/user-attachments/assets/8dff6947-3e3a-4596-8f7b-59c7eed82866" />

7. Before running the server you need to setup some contents inside .env file.
**Note:** `.env` file should be inside the `server` folder.

- jwt secret key (this can be anything of your choice)
- PORT (on which the server will run)
- MongoDB connection string
- saltround (it should be a number of your choice, used for hashing password)
- resend API_KEY
- Twilio accound_sid, auth_token, phone_number

8. Now stay inside server folder itself and do :

 ` npm run server `

- when you run the server all the contents from the .env will be loaded and it prints 
- server is running on "url"
- MongoDB Connected

9. Now use postman to test the API's.
