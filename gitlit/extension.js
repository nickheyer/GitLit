const vscode = require('vscode');
const path = require('path');
const tmp = require('tmp');
const simpleGit = require('simple-git');
const _ = require('lodash');

function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.compareWithBranch', async () => {
        const branch = await vscode.window.showInputBox({
            placeHolder: 'Enter the branch name to compare with'
        });

        if (!branch) {
            vscode.window.showErrorMessage('Branch name is required');
            return;
        }

        const currentWorkspace = _.get(vscode, 'workspace.workspaceFolders[0].uri.fsPath');
        if (!currentWorkspace) {
            vscode.window.showErrorMessage('No workspace folder is open');
            return;
        }

        const git = simpleGit(currentWorkspace);

        let remoteUrl;
        try {
            remoteUrl = await git.remote(['get-url', 'origin']);
        } catch (error) {
            vscode.window.showErrorMessage(`Error getting remote URL: ${error.message}`);
            return;
        }

        const workspacePrefix = path.basename(currentWorkspace) + `_${branch}`;
        tmp.dir({ prefix: workspacePrefix, unsafeCleanup: true }, (err, newPath, cleanupCallback) => {
            if (err) {
                vscode.window.showErrorMessage(`Error creating temporary directory: ${err.message}`);
                return;
            }

            const tmpobj = { name: newPath, removeCallback: cleanupCallback };

            vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(newPath), true);

            const outputChannel = vscode.window.createOutputChannel('Git Operation Progress');
            outputChannel.show(true);

            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Cloning repository and checking out branch...",
                cancellable: true
            }, (progress, token) => {
                return new Promise((resolve, reject) => {
                    token.onCancellationRequested(() => {
                        tmpobj.removeCallback();
                        reject(new Error('Operation cancelled by user'));
                    });

                    (async () => {
                        try {
                            await cloneRepository(git, remoteUrl, tmpobj.name, outputChannel, progress, token);
                            const newGit = simpleGit(tmpobj.name);
                            await fetchBranches(newGit, outputChannel, progress, token);
                            await checkoutBranch(newGit, branch, outputChannel, progress, token);

                            vscode.window.showInformationMessage('Repository cloned and branch checked out successfully.');
                            resolve();
                        } catch (error) {
                            vscode.window.showErrorMessage(`Error: ${error.message}`);
                            tmpobj.removeCallback();
                            reject(error);
                        } finally {
                            outputChannel.dispose();
                        }
                    })();
                });
            });
        });
    });

    context.subscriptions.push(disposable);
    const treeDataProvider = new CompareWithBranchProvider();
    vscode.window.registerTreeDataProvider('compareWithBranchView', treeDataProvider);
}

function cloneRepository(git, remoteUrl, destDir, outputChannel, progress, token) {
    return new Promise((resolve, reject) => {
        const step = 'CLONING...';
        const gitClone = simpleGit();
        gitClone.clone(remoteUrl, destDir, [], (err, data) => {
            if (err) {
                reject(err);
            } else {
                outputChannel.appendLine(data);
                resolve();
            }
        }).then(() => {
            gitClone.progress(({ method, stage, progress: percent }) => {
                progress.report({ message: `${step} ${method} ${stage}`, increment: percent });
                outputChannel.replace(`${step} ${method} ${stage}: ${percent}%`);
            });
        });

        token.onCancellationRequested(() => {
            reject(new Error('Operation cancelled by user'));
        });
    });
}

function fetchBranches(git, outputChannel, progress, token) {
    return new Promise((resolve, reject) => {
        const step = 'FETCHING...';
        git.fetch((err, data) => {
            if (err) {
                reject(err);
            } else {
                outputChannel.appendLine(data);
                resolve();
            }
        }).then(() => {
            git.progress(({ method, stage, progress: percent }) => {
                progress.report({ message: `${step} ${method} ${stage}`, increment: percent });
                outputChannel.replace(`${step} ${method} ${stage}: ${percent}%`);
            });
        });

        token.onCancellationRequested(() => {
            reject(new Error('Operation cancelled by user'));
        });
    });
}

function checkoutBranch(git, branch, outputChannel, progress, token) {
    return new Promise((resolve, reject) => {
        const step = 'CHECKING OUT...';
        git.checkout(branch, (err, data) => {
            if (err) {
                reject(err);
            } else {
                outputChannel.appendLine(data);
                resolve();
            }
        }).then(() => {
            git.progress(({ method, stage, progress: percent }) => {
                progress.report({ message: `${step} ${method} ${stage}`, increment: percent });
                outputChannel.replace(`${step} ${method} ${stage}: ${percent}%`);
            });
        });

        token.onCancellationRequested(() => {
            reject(new Error('Operation cancelled by user'));
        });
    });
}

function deactivate() {}

class CompareWithBranchProvider {
    getTreeItem(element) {
        return element;
    }

    getChildren() {
        return [new CompareWithBranchItem("Compare with Branch")];
    }
}

class CompareWithBranchItem extends vscode.TreeItem {
    constructor(label) {
        super(label);
        this.command = {
            command: 'extension.compareWithBranch',
            title: 'Compare with Branch'
        };
    }
}

module.exports = {
    activate,
    deactivate
};
