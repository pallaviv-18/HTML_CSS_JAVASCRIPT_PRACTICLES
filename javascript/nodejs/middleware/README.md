# Express Middleware Practicals

This project demonstrates:

1. Custom middleware in `middleware/requestContext.js`.
2. Request logging in `middleware/logger.js`.
3. Request validation in `middleware/validateMessage.js`.
4. API-key authentication in `middleware/authenticate.js`.
5. Central error handling in `middleware/errorHandler.js`.
6. Middleware execution order through `GET /api/order`.

## Run it

```bash
npm install
npm start
```

Open `http://localhost:3006`. The protected route accepts the default header
`x-api-key: learning-key`.