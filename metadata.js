import fs from "fs";

for(let i=1; i<=5003; i++){
  console.log("Updating " + i);
  let rawdata = fs.readFileSync("./compressed/" + i + '.json');
  let data = JSON.parse(rawdata);
  data.description = "Kirin Labs collection description";
  
  fs.writeFileSync("./compressed/" + i + '.json', JSON.stringify(data));
}
