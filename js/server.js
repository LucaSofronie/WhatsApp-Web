const http = require("http");
const fs = require("fs");
const url = require("url");
const port = 3000;
const autoBrowser = require("../web scraping/index.js");
const info = require("./personal_infoNode.js");

const server = http.createServer(async function (request, response) {
  response.writeHead(200, { "Content-Type": "text/html" });

  const num = url.parse(request.url, true).query["phoneNumber"];
  console.log(num);
  if (num)
    await autoBrowser.modifyNumber(num, info.email, info.password, info.id);
  response.end();
});

server.listen(port, function (error) {
  if (error) {
    console.log("There was an error", error);
  } else {
    console.log("Server is listening on port " + port);
  }
});
