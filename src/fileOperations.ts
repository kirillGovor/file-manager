import { promises as fs, createReadStream, createWriteStream } from "fs";
import { join, resolve, dirname } from "path";
import { log } from "./utils/logger";

export const cat = async (filePath: string): Promise<void> => {
  const fullPath = join(process.cwd(), filePath);
  const stream = createReadStream(fullPath, "utf-8");

  stream.on("data", (chunk) => console.log(chunk));
  stream.on("error", (err) => log.yellow(`${err}`));
};

export const add = async (fileName: string): Promise<void> => {
  const filePath = join(process.cwd(), fileName);
  createWriteStream(filePath, "utf-8");
  await fs.writeFile(filePath, "");
};

export const rename = async (
  filePath: string,
  newFileNamePath: string
): Promise<void> => {
  try {
    fs.rename(filePath, newFileNamePath);
    log.green("Successfully Renamed File!");
  } catch (error) {
    log.red(`Error rename file: ${error}`);
  }
};

interface DirectoryItem {
  Name: string;
  Type: "file" | "directory";
}

export const ls = async (): Promise<void> => {
  const fullPath = resolve(process.cwd());
  const dirents = await fs.readdir(fullPath, { withFileTypes: true });

  const sortedItems = dirents.sort((a, b) => {
    if (a.isDirectory() === b.isDirectory()) {
      return a.name.localeCompare(b.name);
    }
    return a.isDirectory() ? -1 : 1;
  });

  const items: DirectoryItem[] = sortedItems.map((dirent) => ({
    Name: dirent.name,
    Type: dirent.isDirectory() ? "directory" : "file",
  }));

  console.table(items);
};

export const remove = async (filePath: string): Promise<void> => {
  //@ts-ignore
  fs.unlink(filePath, (error) => {
    if (error) {
      throw new Error(error);
    }

    log.blue("file removed");
  });
};

export const cd = async (newPath: string): Promise<void> => {
  const fullPath = resolve(newPath);
  const stats = await fs.stat(fullPath);

  if (!stats.isDirectory()) {
    log.yellow("The provided path is not a directory.");
    return;
  }

  process.chdir(fullPath);
  log.blue(`Changed directory to ${fullPath}`);
};

export const up = async (): Promise<void> => {
  process.chdir("../");
};

export const cp = async (
  source: string,
  destination: string
): Promise<void> => {
  const sourcePath = resolve(source);
  const destinationPath = resolve(destination);

  const destDir = dirname(destinationPath);
  try {
    await fs.access(destDir);
  } catch (error) {
    await fs.mkdir(destDir, { recursive: true });
  }

  const readStream = createReadStream(sourcePath);
  const writeStream = createWriteStream(destinationPath);

  return new Promise((resolve, reject) => {
    readStream
      .on("error", (error) => reject(error))
      .pipe(writeStream)
      .on("error", (error) => reject(error))
      .on("close", () => resolve());
  });
};

export const mv = async (filePath: string, newFilePath: string) => {
  await fs.mkdir(dirname(newFilePath), { recursive: true });

  return fs.rename(filePath, newFilePath);
};
