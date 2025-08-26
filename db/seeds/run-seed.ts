import db from "../connection";
import seed from "./seed";
import devData from "../data/development-data";

const runSeed = async () => {
  try {
    await seed(devData);
    console.log("Seeding complete!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await db.end();
  }
};

runSeed();
