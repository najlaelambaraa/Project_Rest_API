const fetch = require("node-fetch");
const FormData = require("form-data");
const fs = require("fs");

exports.generateImage = async (prompt) => {
  const formData = new FormData();
  formData.append("prompt", prompt);

  const requestOptions = {
    method: "POST",
    headers: {
      "x-api-key": process.env.CLIPDROP_API_KEY,
    },
    body: formData,
    redirect: "follow",
  };

  const response = await fetch("https://clipdrop-api.co/text-to-image/v1", requestOptions);
  const buffer = await response.arrayBuffer();

  const outputName = Math.random().toString(36) + ".png";
  const imagePath = "./Images/" + outputName;

  fs.writeFileSync(imagePath, Buffer.from(buffer));
  console.log("Saved output to " + imagePath);

  return imagePath;
};


