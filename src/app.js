const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("./db/mongoose");
const Data = require("./models/data");

const app = express();
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.send({ active: true });
});

app.get("/api/data", async (req, res) => {
  try {
    const data = await Data.find({});
    res.send(data);
  } catch (e) {
    res.status(500).send();
  }
});

app.get("/api/data/:id", async (req, res) => {
  try {
    const data = await Data.findOne({ _id: req.params.id });
    res.send(data);
  } catch (e) {
    res.status(404).send();
  }
});

app.post("/api/data", async (req, res) => {
  const data = new Data({
    name: req.body.name,
    sectors: req.body.sectors,
    terms: req.body.terms || false,
  });
  try {
    await data.save();

    res.status(201).send(data);
  } catch (error) {
    res.status(400).send();
  }
});

app.put("/api/data/:id", async (req, res) => {
  const id = req.params.id;
  const allowedUpdates = ["name", "sectors", "terms"];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const data = await Data.findOne({ _id: id });
    if (!data) {
      res.status(404).send();
    }
    updates.forEach((update) => (data[update] = req.body[update]));
    await data.save();
    res.send(data);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.delete("/api/data/:id", async (req, res) => {
  try {
    await Data.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).send();
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server started at PORT ${PORT}`));
