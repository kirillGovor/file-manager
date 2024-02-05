import { createReadStream } from "fs";
import { createHash } from "crypto";

export const calculateHash = async (
  filePath: string,
  algorithm = "sha256"
): Promise<void> => {
  const hash = createHash(algorithm);
  const fileStream = createReadStream(filePath);

  fileStream.on("data", (chunk) => {
    hash.update(chunk);
  });

  fileStream.on("end", () => {
    console.log(`The ${algorithm} hash of the file is: ${hash.digest("hex")}`);
  });

  fileStream.on("error", (error) => {
    console.error("An error occurred:", error);
  });
};
