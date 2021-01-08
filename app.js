// const sampleCode = "./node_modules/mongoose/";
const sampleCode = "./test";
const path = require("path");
const fs = require("fs");
const { logicalRgx } = require("./utils/logicalRgx");

let directories = [{ path: sampleCode }];

const readAllFiles = () => {
  let allFiles = [];
  const regex = /\.js$/;
  while (directories.length) {
    const dirArr = [...directories];
    directories = [];
    dirArr.map((item) => {
      fs.readdirSync(item.path).forEach((file) => {
        if (fs.lstatSync(path.resolve(item.path, file)).isDirectory()) {
          directories.push({ path: path.resolve(item.path, file) });
        } else if (file.match(regex)) {
          allFiles.push({ path: path.resolve(item.path, file) });
        }
      });
    });
  }
  return allFiles;
};

const getAllText = (files) => {
  let allText = [];
  files.map((item) => {
    allText = allText.concat(fs.readFileSync(item.path, "utf8").split("\n"));
  });
  return allText;
};

const checkLinesByRegex = (str, regexSet) => {
  let count = 0;
  for (let i = 0; i < regexSet.length; i++) {
    matches = [...str.matchAll(regexSet[i])];
    if (matches[0]) {
      count += 1;
      break;
    }
  }
  return count;
};

const getMetrics = (text) => {
  let metrics = {
    linesOfCode: 0,
    emptyLines: 0,
    physicalLines: 0,
    logicalLines: 0,
    comments: {
      inlineComments: 0,
      blockComments: 0,
    },
    commentLevel: 0,
  };
  metrics.linesOfCode = text.length;
  let commentFlag = false;
  
  //count and remove all BLOCK comments
  let strWithoutBlockComments = text
    .join("\n")
    .replace(/(\/\*[^*]*\*\/)/g, function (x) {
      metrics.comments.blockComments += 1;
      return ".";
    });

  //count and remove all INLINE comments
  let strWithoutLineComments = strWithoutBlockComments.replace(
    /(\/\/[^* \n]*)/g,
    function (x) {
      metrics.comments.inlineComments += 1;
      return ".";
    }
  );

  text = strWithoutLineComments.split("\n");

  for (let i = 0; i < text.length; i++) {
    if (!text[i]) {
      metrics.emptyLines++;
    }
    //if not empty
    else {
      //checking logical lines
      metrics.logicalLines += checkLinesByRegex(text[i], logicalRgx);
      //checking block 'inline' comments
      // if (text[i].match(/\/\*(\*(?!\/)|[^*])*\*\//g)) {
      //   metrics.comments.blockComments++;
      // }
      // //check for divided block comments
      // if (text[i].match(/\/\*/g)) {
      //   commentFlag = true;
      // } else if (text[i].match(/\*\//g)) {
      //   commentFlag = false;
      //   metrics.comments.blockComments++;
      // } else if (text[i].match(/\/\//g)) {
      //   metrics.comments.inlineComments++;
      // }
    }
  }
  // empty lines considered if don't exceed 25% of LOC
  metrics.physicalLines =
    metrics.emptyLines / metrics.linesOfCode <= 0.25
      ? metrics.linesOfCode
      : metrics.linesOfCode - metrics.emptyLines;
  // percentage ratio
  metrics.commentLevel = (
    (metrics.comments.blockComments + metrics.comments.inlineComments) /
    metrics.linesOfCode
  ).toFixed(3);
  return metrics;
};

let text = getAllText(readAllFiles());
let metrics = getMetrics(text);

console.log(text.length);
console.log(metrics);
