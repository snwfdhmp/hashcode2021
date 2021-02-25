import fs from "fs";
import { gcd } from "mathjs";

let inputSelected = "a";
if (process.argv[2] && process.argv[2] != "") {
  inputSelected = process.argv[2];
}

const main = () => {
  const filePath = "input/" + inputSelected + ".txt";
  const fileLines = fs.readFileSync(filePath).toString().split("\n");
  const [
    duration,
    intersectionCount,
    streetCount,
    carCount,
    reward,
  ] = fileLines[0].split(" ").map((x) => parseInt(x));

  let streetIndex = {};
  let intersections = {};
  for (let i = 1; i <= streetCount; i++) {
    const intersectionId = parseInt(fileLines[i].split(" ")[1]);
    const streetId = fileLines[i].split(" ")[2];
    streetIndex[streetId] = {
      score: 0,
      arrivalIntersection: intersectionId,
      duration: parseInt(fileLines[i].split(" ")[3]),
    };
    if (!intersections[intersectionId]) intersections[intersectionId] = [];
    intersections[intersectionId].push(streetId);
  }

  for (let i = 1 + streetCount; i < 1 + streetCount + carCount; i++) {
    const lineData = fileLines[i].split(" ");
    let totalRoad = 0;
    let addedScore = 0;
    for (let j = 1; j <= lineData[0]; j++) {
      totalRoad += streetIndex[lineData[j]].duration;
      addedScore++;
      streetIndex[lineData[j]].score++;
      if (totalRoad >= duration) {
        streetIndex[lineData[j]].score -= addedScore;
        break;
      }
    }
    console.log(totalRoad);
  }

  let outputLines = [];

  for (let i = 0; i < Object.keys(intersections).length; i++) {
    const intersectionId = Object.keys(intersections)[i];

    const sum = intersections[intersectionId].reduce(
      (total, x) => total + streetIndex[x].score,
      0
    );
    for (let j = 0; j < intersections[intersectionId].length; j++) {
      const ratio = streetIndex[intersections[intersectionId][j]].score / sum;

      streetIndex[intersections[intersectionId][j]].ratio = ratio;
      if (
        ratio <= 0 ||
        isNaN(ratio) ||
        !streetIndex[intersections[intersectionId][j]].ratio
      ) {
        intersections[intersectionId].splice(j, 1);
        j--;
      }
    }
    if (intersections[intersectionId].length <= 0) {
      delete intersections[intersectionId];
      i--;
      continue;
    }
    outputLines.push(`${intersectionId}`);
    outputLines.push(`${intersections[intersectionId].length}`);

    for (let j = 0; j < intersections[intersectionId].length; j++) {
      // const finalDuration = Math.ceil(
      //   streetIndex[intersections[intersectionId][j]].ratio
      // );
      const finalDuration =
        streetIndex[intersections[intersectionId][j]].score /
        gcd_more_than_two_numbers(
          intersections[intersectionId].map((x) => streetIndex[x].score)
        );
      if (isNaN(finalDuration)) {
        console.log(streetIndex[intersections[intersectionId][j]]);
        throw new Error();
      }
      outputLines.push(`${intersections[intersectionId][j]} ${finalDuration}`);
      streetIndex[
        intersections[intersectionId][j]
      ].finalDuration = finalDuration;
    }
  }
  console.log(Object.keys(intersections).length);
  console.log(outputLines.join("\n"));
};

main();

function gcd_more_than_two_numbers(input) {
  if (toString.call(input) !== "[object Array]") return false;
  var len, a, b;
  len = input.length;
  if (!len) {
    return null;
  }
  a = input[0];
  for (var i = 1; i < len; i++) {
    b = input[i];
    a = gcd_two_numbers(a, b);
  }
  return a;
}

function gcd_two_numbers(x, y) {
  if (typeof x !== "number" || typeof y !== "number") return false;
  x = Math.abs(x);
  y = Math.abs(y);
  while (y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}
