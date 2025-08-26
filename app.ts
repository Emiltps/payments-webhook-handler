import express from "express";
import paymentsRoute from "./routes/payments";

const app = express();
app.use(express.json());

app.use(paymentsRoute);

export { app };
