#!/usr/bin/env node
import { Command, configureHelp } from "commander";
import path from "path";
import fs from "fs";
import { path7za } from "7zip-bin";
import { execSync } from "child_process";
import inquirer from "inquirer";

function collect(val: any, memo: any[]) {
  memo.push(val);
  return memo;
}

const program = new Command();

program
  .command("compress")
  .option(
    "-a, --add <path>",
    "Add a file or directory to compress",
    collect,
    []
  )
  .option("-l, --clevel <level>", "Change compression level from 0 to 9")
  .option(
    "-o, --output <path>",
    `Zip file name, example: "archive" will be "archive.zip"`
  )
  .option("-y, --yes", "Answer yes to every prompt")
  .action(compress);

program
  .command("decompress")
  .option("-p --path <path>", "Zip directory")
  .option("-o, --output <path>", `Output directory`)
  .action(decompress);

program.parse(process.argv);

async function compress(options: any) {
  let sevenPath = path.resolve(path7za);

  let paths = options.add;
  paths = paths.filter((f: string) => {
    f = path.resolve(f).replace(/\\/g, "/");
    if (f.endsWith("/*")) {
      f = f.slice(0, -1);
    }
    if (!fs.existsSync(f)) {
      console.log(f, "could not be found, ignoring");
    }
    return fs.existsSync(f);
  });

  paths = paths.map((f: string) => {
    return path.resolve(f);
  });

  let outpath = path.resolve((options.output || "archive") + ".zip");

  if (fs.existsSync(outpath)) {
    if (options.yes === true) {
      fs.unlinkSync(outpath);
    } else {
      let answer = await inquirer.prompt([
        {
          type: "confirm",
          message: "That file already exists, do you want to replace it?",
          name: "askForDeletion",
        },
      ]);
      if (answer.askForDeletion) {
        fs.unlinkSync(outpath);
      } else {
        return console.log("Exited");
      }
    }
  }

  let sevenProcess = execSync(
    `${sevenPath} a ${outpath} -tzip -mx${options.clevel || "9"} "${paths.join(
      '" "'
    )}"`
  );

  console.log("Success, created", outpath, "with 7z");
}

function decompress(options: any) {
  let sevenPath = path.resolve(path7za);

  if (!options.path) return console.error("You need to include a --path");

  let zipPath = path.resolve(options.path);

  if (!fs.existsSync(zipPath))
    return console.error("The zip path doesn't exist");

  let outPath = path.resolve(options.output || "output");

  if (!fs.existsSync(path.dirname(outPath)))
    return console.error("The out path doesn't exist");

  let sevenProcess = execSync(`${sevenPath} x ${zipPath} "-o${outPath}"`);

  console.log("Success, decompressed", outPath, "with 7z");
}
