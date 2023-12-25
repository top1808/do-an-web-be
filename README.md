First, you have to install module: npm install
<br />
Second, you create file ".env" in root directory with content:
```bash
MONGO_DB_URL = "mongodb+srv://top1808:vGSlA80YSUPiFgSr@cluster0.7alxuod.mongodb.net/"
PORT = 8000
JWT_ACCESS_KEY ="access_token_key_123213"
JWT_REFRESH_KEY ="refresh_token_key_12312321"
```
Third, run the development server: **npm run dev**
<br />
Open http://localhost:8000 with your browser to see the result.
