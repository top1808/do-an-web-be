First, you have to install module: npm install
<br />
Second, you create file ".env" in root directory with content:
```bash
MONGO_DB_URL = "mongodb+srv://top1808:vGSlA80YSUPiFgSr@cluster0.7alxuod.mongodb.net/"
PORT = 8000
JWT_ACCESS_KEY ="access_token_key_123213"
JWT_REFRESH_KEY ="refresh_token_key_12312321"
FIREBASE_CLOUD_MESSAGING_KEY="AAAAfjLVIKA:APA91bEbj_aM-UqbWuxxLps-9cAiPk9ZnXDN1uNyOOYwbcFK3pinTYgg5Ec54DSLJe-qsTMY7YmNBWAZMmVaN3-1jNjybZfBGLuJPucm1avlkpRFVkV0VRakOAXioOdOpweZhyjGTFI2"
PUSHER_KEY="786a90462cba76058ce2"
PUSHER_SECRET="33917c292ea87df2a323"
```
Third, run the development server: **npm run dev**
<br />
Open http://localhost:8000 with your browser to see the result.
