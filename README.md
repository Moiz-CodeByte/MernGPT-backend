
# MERN Stack AI Chatbot

This is an AI Chatbot application, inspired by ChatGPT, by using MERN Stack and Groq API (Llama3 model)

It's a customized chatbot where each message of the user is stored in DB and can be retrieved and deleted.

It's a completely secure application using JWT Tokens, HTTP-Only Cookies, Signed Cookies, Password Encryption, and Middleware Chains.

## Deployment to Heroku

### Prerequisites
- Heroku account
- Heroku CLI installed
- Git installed

### Steps to Deploy

1. **Login to Heroku**
   ```
   heroku login
   ```

2. **Create a new Heroku app**
   ```
   heroku create your-app-name
   ```

3. **Set Environment Variables**
   Set all the required environment variables in Heroku dashboard or using CLI:
   ```
   heroku config:set MONGODB_URL=your_mongodb_connection_string
   heroku config:set JWT_SECRET=your_jwt_secret_key
   heroku config:set COOKIE_SECRET=your_cookie_secret
   heroku config:set GROK_API_KEY=your_groq_api_key
   heroku config:set NODE_ENV=production
   heroku config:set FRONTEND_URL=https://your-frontend-app.herokuapp.com
   heroku config:set DOMAIN=your-frontend-app.herokuapp.com
   ```

4. **Push to Heroku**
   ```
   git push heroku main
   ```

5. **Open the app**
   ```
   heroku open
   ```

## Local Development

1. Clone the repository
2. Create a `.env` file based on `.env.example`
3. Install dependencies: `npm install`
4. Run in development mode: `npm run dev`

Contributions are welcome

