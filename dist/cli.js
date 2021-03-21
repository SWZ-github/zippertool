#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var commander_1 = require("commander");
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var _7zip_bin_1 = require("7zip-bin");
var child_process_1 = require("child_process");
var inquirer_1 = __importDefault(require("inquirer"));
function collect(val, memo) {
    memo.push(val);
    return memo;
}
var program = new commander_1.Command();
program
    .command("compress")
    .option("-a, --add <path>", "Add a file or directory to compress", collect, [])
    .option("-l, --clevel <level>", "Change compression level from 0 to 9")
    .option("-o, --output <path>", "Zip file name, example: \"archive\" will be \"archive.zip\"")
    .option("-y, --yes", "Answer yes to every prompt")
    .action(compress);
program
    .command("decompress")
    .option("-p --path <path>", "Zip directory")
    .option("-o, --output <path>", "Output directory")
    .action(decompress);
program.parse(process.argv);
function compress(options) {
    return __awaiter(this, void 0, void 0, function () {
        var sevenPath, paths, outpath, answer, sevenProcess;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sevenPath = path_1["default"].resolve(_7zip_bin_1.path7za);
                    paths = options.add;
                    paths = paths.filter(function (f) {
                        f = path_1["default"].resolve(f).replace(/\\/g, "/");
                        if (f.endsWith("/*")) {
                            f = f.slice(0, -1);
                        }
                        if (!fs_1["default"].existsSync(f)) {
                            console.log(f, "could not be found, ignoring");
                        }
                        return fs_1["default"].existsSync(f);
                    });
                    paths = paths.map(function (f) {
                        return path_1["default"].resolve(f);
                    });
                    outpath = path_1["default"].resolve((options.output || "archive") + ".zip");
                    if (!fs_1["default"].existsSync(outpath)) return [3 /*break*/, 3];
                    if (!(options.yes === true)) return [3 /*break*/, 1];
                    fs_1["default"].unlinkSync(outpath);
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, inquirer_1["default"].prompt([
                        {
                            type: "confirm",
                            message: "That file already exists, do you want to replace it?",
                            name: "askForDeletion"
                        },
                    ])];
                case 2:
                    answer = _a.sent();
                    if (answer.askForDeletion) {
                        fs_1["default"].unlinkSync(outpath);
                    }
                    else {
                        return [2 /*return*/, console.log("Exited")];
                    }
                    _a.label = 3;
                case 3:
                    sevenProcess = child_process_1.execSync(sevenPath + " a " + outpath + " -tzip -mx" + (options.clevel || "9") + " \"" + paths.join('" "') + "\"");
                    console.log("Success, created", outpath, "with 7z");
                    return [2 /*return*/];
            }
        });
    });
}
function decompress(options) {
    var sevenPath = path_1["default"].resolve(_7zip_bin_1.path7za);
    if (!options.path)
        return console.error("You need to include a --path");
    var zipPath = path_1["default"].resolve(options.path);
    if (!fs_1["default"].existsSync(zipPath))
        return console.error("The zip path doesn't exist");
    var outPath = path_1["default"].resolve(options.output || "output");
    if (!fs_1["default"].existsSync(path_1["default"].dirname(outPath)))
        return console.error("The out path doesn't exist");
    var sevenProcess = child_process_1.execSync(sevenPath + " x " + zipPath + " \"-o" + outPath + "\"");
    console.log("Success, decompressed", outPath, "with 7z");
}
