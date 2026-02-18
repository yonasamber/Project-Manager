import express from "express";
import "dotenv/config";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

app.get("/", (req, res) => res.send("server is running!"));

app.use("/api/inngest", serve({ client: inngest, functions }));

app.listen(port, () => {
  console.log(`Server is runnig on port-${port}`);
});
