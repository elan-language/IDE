// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as https from "https";
import { ElanEditorProvider } from "./elanEditor";
import { parse as parseUrl } from "url";
import * as yauzl from "yauzl";
import * as path from "path";
import { mkdirp } from "async-file";
import * as fs from "fs";
import { LanguageClient, LanguageClientOptions, ServerOptions } from "vscode-languageclient/node";

let client: LanguageClient | undefined;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "elan" is now active!');

  const compilerPath = `${context.extensionPath}\\.elanCompiler\\`;
  const languageServerPath = `${context.extensionPath}\\.elanLanguageServer\\`;

  const buildTask = new vscode.Task(
    { type: "process" },
    vscode.TaskScope.Workspace,
    "Compile",
    "elan",
    new vscode.ProcessExecution(`${compilerPath}bc.exe`, [
      "${fileDirname}\\${fileBasename}",
      "${workspaceFolder}",
    ]),
  );

  buildTask.group = { id: vscode.TaskGroup.Build.id, isDefault: true };

  const runTask = new vscode.Task(
    { type: "process" },
    vscode.TaskScope.Workspace,
    "Run",
    "elan",
    new vscode.ProcessExecution(
      "${workspaceFolder}\\obj\\bin\\Debug\\net7.0\\${fileBasenameNoExtension}.exe",
      [],
    ),
  );

  runTask.group = vscode.TaskGroup.Test;

  vscode.tasks.registerTaskProvider("elan", {
    provideTasks: () => {
      return [buildTask, runTask];
    },
    resolveTask(_task: vscode.Task): vscode.Task | undefined {
      return undefined;
    },
  });

  context.subscriptions.push(ElanEditorProvider.register(context));

  const buff1 = await downloadServer(
    "https://ci.appveyor.com/api/buildjobs/g4j3ur8v23tmnmkk/artifacts/Compiler%2Fbin%2FDebug%2Fbc.zip",
  );
  await InstallZip(buff1, "elan compiler", compilerPath, []);
  const buff2 = await downloadServer(
    "https://ci.appveyor.com/api/buildjobs/g4j3ur8v23tmnmkk/artifacts/LanguageServer%2Fbin%2FDebug%2FLanguageServer.zip",
  );
  await InstallZip(buff2, "elan language server", languageServerPath, []);

  startLanguageServer(context, languageServerPath);
}

// This method is called when your extension is deactivated
export function deactivate() {
  if (!client) {
    return undefined;
  }
  return client.stop();
}

async function downloadServer(urlString: string): Promise<Buffer> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffers: any[] = [];
  const url = parseUrl(urlString);

  const options: https.RequestOptions = {
    host: url.hostname,
    port: url.port,
    path: url.path,
    method: "GET",
  };
  return new Promise<Buffer>((resolve, reject) => {
    const req = https.request(options, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Redirect - download from new location
        if (response.headers.location === undefined) {
          console.warn(`Failed to download from appveyor. Redirected without location header`);
          return reject();
        }
        return resolve(downloadServer(response.headers.location));
      } else if (response.statusCode !== 200) {
        // Download failed - print error message
        console.warn(`Failed to download from appveyor. Error code '${response.statusCode}')`);
        return reject(); // Known to exist because this is from a ClientRequest
      }

      if (response.headers["content-length"] === undefined) {
        console.warn(`Failed to download from appveyor. No content-length header`);
        return reject();
      }

      // Downloading - hook up events
      let downloadedBytes = 0;

      response.on("data", (data) => {
        downloadedBytes += data.length;
        buffers.push(data);
      });

      response.on("end", () => {
        resolve(Buffer.concat(buffers));
      });

      response.on("error", (err) => {
        console.warn(
          `Failed to download from ${urlString}. Error Message: ${err.message} || 'NONE'}`,
        );
        reject();
      });
    });

    req.on("error", function (e) {
      console.log("problem with request: " + e.message);
    });

    req.end();
  });
}

export async function InstallZip(
  buffer: Buffer,
  description: string,
  destinationInstallPath: string,
  binaries: string[] | undefined,
): Promise<void> {
  //eventStream.post(new InstallationStart(description));

  return new Promise<void>((resolve, reject) => {
    yauzl.fromBuffer(buffer, { lazyEntries: true }, (err, zipFile) => {
      if (err !== null) {
        const message =
          "C# Extension was unable to download its dependencies. Please check your internet connection. If you use a proxy server, please visit https://aka.ms/VsCodeCsharpNetworking";
        console.warn(message);
        return reject();
      }

      zipFile.readEntry();

      zipFile.on("entry", async (entry: yauzl.Entry) => {
        const absoluteEntryPath = path.resolve(destinationInstallPath, entry.fileName);

        if (entry.fileName.endsWith("/")) {
          // Directory - create it
          try {
            await mkdirp(absoluteEntryPath, 0o775);
            zipFile.readEntry();
          } catch (err) {
            const error = err as NodeJS.ErrnoException; // Hack for TypeScript to type err correctly
            console.warn("Error creating directory for zip directory entry:" + (error.code ?? ""));
            return reject();
          }
        } else {
          // File - extract it
          zipFile.openReadStream(entry, async (err, readStream) => {
            if (err) {
              console.warn("Error reading zip stream");
              return reject();
            }

            try {
              await mkdirp(path.dirname(absoluteEntryPath), 0o775);

              // Make sure executable files have correct permissions when extracted
              // const binaryPaths = binaries?.map((binary) => binary.value);
              //const fileMode = binaryPaths?.includes(absoluteEntryPath) ? 0o755 : 0o664;
              const fileMode = 0o755;

              readStream.pipe(fs.createWriteStream(absoluteEntryPath, { mode: fileMode }));
              readStream.on("end", () => zipFile.readEntry());
            } catch (err) {
              console.warn("Error creating directory for zip file entry");
              return reject();
            }
          });
        }
      });

      zipFile.on("end", () => {
        resolve();
      });

      zipFile.on("error", (err) => {
        console.warn("Zip File Error:" + err.code || "");
        reject();
      });
    });
  });
}

export function startLanguageServer(context: vscode.ExtensionContext, languageServerPath: string) {
  // The server is implemented in dotnet
  const serverExe = "dotnet";

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  const serverOptions: ServerOptions = {
    run: {
      command: serverExe,
      args: [`${languageServerPath}LanguageServer.dll`],
    },
    debug: {
      command: serverExe,
      args: [`${languageServerPath}LanguageServer.dll`],
    },
  };

  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    // Register the server for elan documents
    documentSelector: [
      {
        pattern: "**/*.elan",
      },
    ],
    synchronize: {
      // Synchronize the setting section 'elanLanguageServer' to the server
      configurationSection: "elanLanguageServer",
      fileEvents: vscode.workspace.createFileSystemWatcher("**/*.elan"),
    },
  };

  // Create the language client and start the client.
  const client = new LanguageClient(
    "elanLanguageServer",
    "Elan Language Server",
    serverOptions,
    clientOptions,
  );

  client.start();
}
