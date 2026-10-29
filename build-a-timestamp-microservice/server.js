const express = require("express");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile("views/index.html", { root: process.cwd() });
});

function respond(res, date) {
  if (isNaN(date.getTime())) {
    return res.json({ error: "Invalid Date" });
  }
  res.json({ unix: date.getTime(), utc: date.toUTCString() });
}

app.get("/api", (req, res) => {
  respond(res, new Date());
});

app.get("/api/:date", (req, res) => {
  const { date } = req.params;
  const parsed = /^-?\d+$/.test(date) ? new Date(Number(date)) : new Date(date);
  respond(res, parsed);
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
