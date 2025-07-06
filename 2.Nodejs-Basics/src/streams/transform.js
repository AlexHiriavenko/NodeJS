import { Transform } from "stream";
import { pipeline } from "stream/promises";

const transform = async () => {
  try {
    const reverseTransform = new Transform({
      transform(chunk, encoding, callback) {
        const reversedText = chunk.toString().split("").reverse().join("");
        callback(null, `${reversedText}\n`);
      },
    });

    await pipeline(process.stdin, reverseTransform, process.stdout);
  } catch (error) {
    throw new Error("transform error", { cause: error });
  }
};

await transform();
