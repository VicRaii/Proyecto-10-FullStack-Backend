const mongoose = require("mongoose");
const Champion = require("../../api/models/Champion");
const {
  bandleCity,
  bilgewater,
  demacia,
  freljord,
  ionia,
  ixtal,
  targon,
  noxus,
  piltover,
  shurima,
  shadowIsles,
  runeterra,
  theVoid,
  zaun,
} = require("../../data/champions");

const launchSeed = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(
      "mongodb+srv://VMRP:bNX8VY3fVJPATNi2@cluster0.1vgag.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Connected to MongoDB");

    await Champion.collection.drop();
    console.log("Champions collection dropped");

    await Champion.insertMany(bandleCity);
    await Champion.insertMany(bilgewater);
    await Champion.insertMany(demacia);
    await Champion.insertMany(freljord);
    await Champion.insertMany(ionia);
    await Champion.insertMany(ixtal);
    await Champion.insertMany(targon);
    await Champion.insertMany(noxus);
    await Champion.insertMany(piltover);
    await Champion.insertMany(shurima);
    await Champion.insertMany(shadowIsles);
    await Champion.insertMany(runeterra);
    await Champion.insertMany(theVoid);
    await Champion.insertMany(zaun);
    console.log("Champions inserted");

    await mongoose.disconnect();
    console.log("Disconnected from database");
  } catch (error) {
    console.error("Error:", error);
  }
};

launchSeed();
