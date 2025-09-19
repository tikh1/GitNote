import * as vscode from 'vscode';
import { execSync } from 'child_process';

export function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "gitnote" is now active!');

    const localusername = (cwd: string) => execSync('git config user.name', { encoding: 'utf-8', cwd }).trim();
    const localemail = (cwd: string) => execSync('git config user.email', { encoding: 'utf-8', cwd }).trim();

    const localInfo = vscode.commands.registerCommand('gitnote.localinfo', () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage("Lütfen bir workspace açın.");
            return;
        }
        const projectPath = workspaceFolders[0].uri.fsPath;

        try {
            console.log('Local Git User Info:');
            console.log(localusername(projectPath));
            console.log(localemail(projectPath));
        } catch (err) {
            vscode.window.showErrorMessage('Git kullanıcı bilgisi alınamadı. Projede git bulunduğundan emin olun.');
        }
    });
    context.subscriptions.push(localInfo);

    const gitContributors = vscode.commands.registerCommand('gitnote.contributors', () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage("Hımmm Looks like there is no .git folder here.");
            return;
        }
        const projectPath = workspaceFolders[0].uri.fsPath;

        try {
            const out = execSync('git log --pretty=format:"%H|%an|%ae"', { encoding: 'utf-8', cwd: projectPath, windowsHide: true });
            const lines = out.split('\n').filter(Boolean);

            const contributorsMap = new Map<string, { sha: string, name: string, email: string }>();
            for (const line of lines) {
                const [sha, name, email] = line.split('|');
                const key = `${name} <${email}>`;
                if (!contributorsMap.has(key)) {
                    contributorsMap.set(key, { sha, name, email });
                }
            }

            console.log('Contributors from local .git:');
            for (const [key] of contributorsMap.entries()) {
                console.log(key);
            }

        } catch (err) {
            vscode.window.showErrorMessage('Could not get Git commit information.');
        }
    });
    context.subscriptions.push(gitContributors);

	const disposableInit = vscode.commands.registerCommand('gitnote.initialize', async () => {
		await vscode.commands.executeCommand('setContext', 'gitnote.initialized', true);
		vscode.window.showInformationMessage('GitNote initialized!');
	});
	context.subscriptions.push(disposableInit);
}

export function deactivate() {
    console.log('GitNote is now deactivated!');
}
