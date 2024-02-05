import { createInterface } from "readline";
import * as fileOps from "./fileOperations";
import { homedir } from "os";
import * as sysInfo from "./systemInfo";
import * as compression from "./compression";
import * as hash from "./hash";
import { log } from "./utils/logger";
import { cwd } from "process";
import { renderPath } from "./utils/renderPath";

const getUsernameFromArgs = (): string => {
  const usernameArg = process.argv.find((arg) => arg.startsWith("--username="));
  if (!usernameArg) {
    console.error("Username not provided.");
    process.exit(1);
  }
  return usernameArg.split("=")[1];
};

const username = getUsernameFromArgs();
log.green(`Welcome to the File Manager, ${username}!`);

process.chdir(homedir());
log.blue(`You are currently in ${homedir()}`);

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: `${cwd()}: `,
});

rl.prompt();

rl.on("line", async (input) => {
  const [command, arg1, arg2] = input.split(" ");
  const currentPath = cwd();
  try {
    switch (command.trim()) {
      case "up":
        await fileOps.up();
        rl.setPrompt(`${currentPath}: `);
        break;
      case "cd":
        await fileOps.cd(arg1);
        rl.setPrompt(`${cwd()}: `);
        break;
      case "ls":
        await fileOps.ls();
        break;
      case "cat":
        await fileOps.cat(arg1);
        break;
      case "add":
        await fileOps.add(arg1);
        break;
      case "rn":
        await fileOps.rename(arg1, arg2);
        break;
      case "cp":
        await fileOps.cp(
          renderPath(currentPath, arg1),
          renderPath(currentPath, arg2)
        );
        break;
      case "mv":
        await fileOps.mv(
          renderPath(currentPath, arg1),
          renderPath(currentPath, arg2)
        );
        break;
      case "rm":
        await fileOps.remove(renderPath(currentPath, arg1));
        break;
      case "os":
        switch (arg1) {
          case "--EOL":
            await sysInfo.getEOL();
            break;
          case "--cpus":
            await sysInfo.getCpus();
            break;
          case "--homedir":
            await sysInfo.getHomedir();
            break;
          case "--username":
            await sysInfo.getUsername();
            break;
          case "--architecture":
            await sysInfo.getArchitecture();
            break;
          default:
            log.red("Invalid argument for os command");
        }
        break;
      case "compress":
        await compression.compress(arg1, arg2);
        break;
      case "decompress":
        await compression.compress(arg1, arg2);
        break;
      case "hash":
        await hash.calculateHash(arg1);
        hash;
        break;
      case ".exit":
        rl.close();
        break;
      default:
        log.yellow("Unknown command");
    }
  } catch (error: any) {
    log.red(`Error: ${error?.message}`);
  }
  rl.prompt();
}).on("close", () => {
  log.blue(`Thank you for using File Manager, ${username}, goodbye!`);
  process.exit(0);
});
