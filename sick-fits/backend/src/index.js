const cookieParser = require("cookie-parser");
require("dotenv").config();
const createServer = require("./createServer");
const db = require("./db");
const jwt = require("jsonwebtoken");

const server = createServer();

// TODO Use express middlware to handle cookies (JWT)
server.express.use(cookieParser());

// TODO Use express middlware to populate current user
// 1. Decode the JWT so we can get the user Id on each request
server.express.use((req, res, next) => {
  const { token } = req.cookies;

  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // put the userId onto the request for future requests to access
    req.userId = userId;
  }
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  deets => {
    console.log(`Server is now running on port http://localhost:${deets.port}`);
  }
);
