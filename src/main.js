import fs from "fs";
import { createCanvas, loadImage } from "canvas";
import { format, rarities, supply, startIndex } from "./config.js";

if (!process.env.PWD) {
  process.env.PWD = process.cwd();
}

const buildDir = `${process.env.PWD}/build`;
const layersDir = `${process.env.PWD}/layers`;

let genes = [];
let geneStrings = [];

String.prototype.hashCode = function () {
  var hash = 0,
    i,
    chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

const generateGenes = async () => {
  for (let index = 0; index < startIndex; index++) {
    geneStrings.push(index);
    genes.push(index);
  }
  rarities.map((rarity) => {
    for (let index = startIndex; index < supply; index++) {
      let rarityValue = 1.0;
      let breed = rarity.BACKGROUND.Types[0];

      let temp = rarity.BACKGROUND.Types.length;
      const bgIdx = Math.floor(Math.random() * temp);
      let background = rarity.BACKGROUND.Types[bgIdx];

      temp = rarity.FRONTGEAR.Types.length;
      const fgIdx = Math.floor(Math.random() * temp);
      let frontdx = rarity.FRONTGEAR.Types[fgIdx];

      temp = rarity.MASK.Types.length;
      const maskIdx = Math.floor(Math.random() * temp);
      let mask = rarity.MASK.Types[maskIdx];

      let skinIdx = 0;
      let skin = rarity.BASE.Types[skinIdx];

      temp = rarity.EYES.Types.length;
      const decorIdx = Math.floor(Math.random() * temp);
      let decor = rarity.EYES.Types[decorIdx];

      temp = rarity.BACKGEAR.Types.length;
      const eyesIdx = Math.floor(Math.random() * temp);
      let eyes = rarity.BACKGEAR.Types[eyesIdx];
      
      temp = rarity.OUTFIT.Types.length;
      const headIdx = Math.floor(Math.random() * temp);
      let head = rarity.OUTFIT.Types[headIdx];

      temp = rarity.HAIR.Types.length;
      const fitIdx = Math.floor(Math.random() * temp);
      let fit = rarity.EYEWEAR.Types[fitIdx];

      temp = rarity.MOUTH.Types.length;
      const noseIdx = Math.floor(Math.random() * temp);
      let nose = rarity.MOUTH.Types[noseIdx];

      temp = rarity.HAIR.Types.length;
      const HairIdx = Math.floor(Math.random() * temp);
      let hair = rarity.HAIR.Types[HairIdx];

      temp = rarity.HEADGEAR.Types.length;
      const HeadGearIdx = Math.floor(Math.random() * temp);
      let HeadGear = rarity.HEADGEAR.Types[HeadGearIdx];

      let geneString =
        background +
        ":" +
        mask +
        ":" +
        frontdx +
        ":" +
        skin +
        ":" +
        decor +
        ":" +
        eyes +
        ":" +
        head +
        ":" +
        fit +
        ":" +
        nose +
        ":" +
        hair +
        ":" +
        HeadGear;
      let hashCode = geneString.hashCode();

      if (geneStrings.includes(geneString)) index--;
      else {
        geneStrings.push(geneString);
        genes.push({
          background,
          mask,
          frontdx,
          skin,
          decor,
          eyes,
          head,
          fit,
          nose,
          hair,
          HeadGear,
        });
      }
    }
  });
};

const drawLayer = async (index, pathName, _canvas, _ctx) => {
  const image = await loadImage(`${layersDir}/${pathName}.png`);
  _ctx.drawImage(image, 0, 0, format.width, format.height);
  fs.writeFileSync(`${buildDir}/${index}.png`, _canvas.toBuffer("image/png"));
};

const generateImage = async (index) => {
  const canvas = createCanvas(format.width, format.height);
  const ctx = canvas.getContext("2d");
  await drawLayer(index, "BACKGROUND/" + genes[index].background, canvas, ctx);
  await drawLayer(index, "BACKGEAR/" + genes[index].eyes, canvas, ctx);
  await drawLayer(index, "FRONTGEAR/" + genes[index].frontdx, canvas, ctx);
  await drawLayer(index, "BASE/" + genes[index].skin, canvas, ctx);
  await drawLayer(index, "EYES/" + genes[index].decor, canvas, ctx);
  await drawLayer(index, "OUTFIT/" + genes[index].head, canvas, ctx);
  // await drawLayer(index, "EYEWEAR/" + genes[index].fit, canvas, ctx);
  await drawLayer(index, "HAIR/" + genes[index].hair, canvas, ctx);
  await drawLayer(index, "MOUTH/" + genes[index].nose, canvas, ctx);
  // await drawLayer(index, "MASK/" + genes[index].mask, canvas, ctx);
  await drawLayer(index, "HEADGEAR/" + genes[index].HeadGear, canvas, ctx);
};

const generateMetaData = async (index) => {
  fs.writeFileSync(
    `${buildDir}/${index}.json`,
    JSON.stringify(
      {
        name: "Kirin Labs #" + index,
        symbol: "KL",
        description:
          "A series of good peeps crafting products you need in your daily Web3 journey.",
        image: "" + index + ".png",
        seller_fee_basis_points: 2222,
        edition: index,
        attributes: [
          {
            trait_type: "Background",
            value: genes[index].background,
          },
          {
            trait_type: "Front Gear",
            value: genes[index].frontdx,
          },
          {
            trait_type: "Mask",
            value: genes[index].mask,
          },
          {
            trait_type: "Eyes",
            value: genes[index].decor,
          },
          {
            trait_type: "Head Gear",
            value: genes[index].HeadGear,
          },
          {
            trait_type: "Back Gear",
            value: genes[index].eyes,
          },
          {
            trait_type: "Outfit",
            value: genes[index].head,
          },
          {
            trait_type: "EyeWare",
            value: genes[index].fit,
          },
          {
            trait_type: "Mouth",
            value: genes[index].nose,
          },
          {
            trait_type: "Hair",
            value: genes[index].hair,
          },
          {
            trait_type: "Nose",
            value: genes[index].fit,
          },
        ],
        properties: {
          files: [
            {
              uri: "" + index + ".png",
              type: "image/png",
            },
          ],
          category: "image",
          collection: {
            name: "Kirin Labs",
            family: "KL",
          },
          creators: [
            {
              address: "rrAnDb1dVWyKAhpi6xomBs4fS6HGzKRVGVwqE25Lb5t",
              share: 100,
            },
          ],
        },
        compiler: "Oracle",
      },
      null,
      2
    )
  );
};

export const cleanProject = () => {
  if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true });
  }
  fs.mkdirSync(buildDir);
};

export const generateNFTData = async () => {
  generateGenes();
  for (let i = startIndex; i < supply; i++) {
    let Promises = [];
    // for (let j = 0; j < 20; j++) {
    Promises.push(generateImage(i));
    Promises.push(generateMetaData(i));
    // }
    await Promise.all(Promises);
  }
};
