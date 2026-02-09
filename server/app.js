import express from "express";
import cors from "cors";
import "./dbConnect.js";

import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express'

import dotenv from "dotenv";

import authRouter from "./routes/user.route.js";
import customerRouter from "./routes/customer.route.js";
import tellerRouter from "./routes/teller.route.js";
import accountRouter from "./routes/account.route.js";
import adminRouter from "./routes/admin.route.js";
import transactionRouter from "./routes/transaction.route.js";
// import ipPolicyMiddleware from "./middlewares/ipPolicy.middleware.js";

import docRouter from "./routes/swagger.doc.js";

dotenv.config();
const PORT = process.env.PORT || 6030;

const app = express();

app.use(cors());
app.use(express.json());

const options = {
    definition: {
        openapi: "3.0.0",
        info:{
            title: "csBank API",
            version: "1.0.0",
            description: "Server APIs for Banking Application"
        },
        servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    },
    apis: ["./routes/*.js"]
}

const specs = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use("/doc", docRouter);



// Routes
app.use("/api/auth", authRouter);
app.use("/api/customers", customerRouter);
app.use("/api/tellers", tellerRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/admin", adminRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found !" });
});

// Start server
// server.listen(PORT, () => {
//   console.log(`Server is running at http://localhost:${PORT}`);
// });

export default app;

