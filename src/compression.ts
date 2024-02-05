import { createReadStream, createWriteStream } from "fs";
import { createBrotliCompress, createBrotliDecompress } from "zlib";
import { join } from "path";

export const compress = async (
  filePath: string,
  destination: string
): Promise<void> => {
  try {
    const sourcePath = join(process.cwd(), filePath);
    const destPath = join(process.cwd(), destination);
    const source = createReadStream(sourcePath);
    const dest = createWriteStream(destPath);
    const brotli = createBrotliCompress();
    source.pipe(brotli).pipe(dest);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const decompress = async (
  filePath: string,
  destination: string
): Promise<void> => {
  try {
    const sourcePath = join(process.cwd(), filePath);
    const destPath = join(process.cwd(), destination);
    const source = createReadStream(sourcePath);
    const dest = createWriteStream(destPath);
    const brotliDecompress = createBrotliDecompress();
    source.pipe(brotliDecompress).pipe(dest);
  } catch (error: any) {
    throw new Error(error);
  }
};
