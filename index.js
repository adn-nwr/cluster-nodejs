const express = require("express");
const cluster = require("cluster");

const num_workers = 4;

const app = express();

app.get("/", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  res.send(`ok...${process.pid}`);
  //   cluster.worker.kill();
});

if (cluster.isMaster) {
  for (let index = 0; index < num_workers; index++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  app.listen(8383, () => {
    console.log(`server ${process.pid} @ http://localhost:8383`);
  });
}
