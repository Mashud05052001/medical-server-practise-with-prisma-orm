import express from "express";
import { app } from "./app";
import { Server } from "http";

let server: Server;
const port = process.env.PORT || 5000;

async function connectServer() {
  try {
    server = app.listen(port, () =>
      console.log(`🔥 The server is running on ${port} port`)
    );
  } catch (error) {
    console.log(`🥴 Error found in server connection time`);
  }
}

connectServer();
