import { cpus, EOL, homedir, userInfo, arch } from "os";
import { log } from "./utils/logger";

export const getEOL = (): void => {
  log.blue(`The default system End-Of-Line marker is: ${JSON.stringify(EOL)}`);
};

export const getCpus = (): void => {
  log.blue(`Total CPUs: ${cpus().length}`);
  const cpusInfo = cpus().map((cpu, index) => ({
    Model: cpu.model,
    Speed: `${cpu.speed / 1000}GHz`,
  }));

  console.table(cpusInfo);
};

export const getHomedir = (): void => {
  log.blue(`The current user's home directory is: ${homedir()}`);
};

export const getUsername = (): void => {
  const username = userInfo().username;
  log.blue(`The current system user name is: ${username}`);
};

export const getArchitecture = (): void => {
  log.blue(`The current system architecture is: ${arch()}`);
};
