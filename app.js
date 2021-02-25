import fs from "fs";

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
    };
    if (!intersections[intersectionId]) intersections[intersectionId] = [];
    intersections[intersectionId].push(streetId);
  }

  for (let i = 1 + streetCount; i < 1 + streetCount + carCount; i++) {
    const lineData = fileLines[i].split(" ");
    for (let j = 1; j <= lineData[0]; j++) {
      streetIndex[lineData[j]].score += 1;
    }
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
      const finalDuration = streetIndex[intersections[intersectionId][j]].score;
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
