import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "gitnote" is now active!');

	const disposableHello = vscode.commands.registerCommand('gitnote.helloWorld', () => {
		vscode.window.showInformationMessage('Show Note from GitNote!');
	});
	context.subscriptions.push(disposableHello);

	const disposableInit = vscode.commands.registerCommand('gitnote.initialize', async () => {
		await vscode.commands.executeCommand('setContext', 'gitnote.initialized', true);
		vscode.window.showInformationMessage('GitNote initialized!');
	});
	context.subscriptions.push(disposableInit);

}

export function deactivate() {

	console.log('GitNote is now deactivated!');
}
