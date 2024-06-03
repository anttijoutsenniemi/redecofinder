import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
dotenv.config();
import helmet from "helmet";
import apiRoute from "./routes/apiRoute";
import expressBasicAuth from "express-basic-auth";

const app : Application = express();

//http basic auth
const authenticate =
  expressBasicAuth({
    users: {
      [process.env.HTTP_BASIC_AUTH_USERNAME!]: process.env.HTTP_BASIC_AUTH_PASSWORD!
    },
    unauthorizedResponse: getUnauthorizedResponse,
    challenge: true
});

function getUnauthorizedResponse(req:any) {
    return req.auth
        ? 'Credentials rejected'
        : 'No credentials provided';
}

//content security policy config to only accept scripts from self source
const cspConfig = {
  directives: {
    defaultSrc: ["'self'"]
  },
};

//secure server headers
app.use(helmet({
  contentSecurityPolicy: cspConfig
}));

const port = process.env.PORT || 8000;


app.use(express.json({limit: '50mb'})); //receive req.body

//here only apiroute is authenticated at the moment
app.use("/api", authenticate, apiRoute);

app.get("/", (req: Request, res: Response) => {
  try {
    res.status(200).json({ Message: "Welcome to the homepage" });
  } catch (e: any) {
    res.status(404).json({ error: `error fetching: ${e}` });
  }
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});