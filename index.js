import { cleanProject, generateNFTData } from "./src/main.js";
import fetch from "node-fetch";
import fs from "fs";

(async () => {
  cleanProject();
  generateNFTData();
})();
