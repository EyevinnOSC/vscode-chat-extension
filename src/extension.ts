import * as vscode from 'vscode';
import { registerOscParticipant } from './osc';
import { Context } from '@osaas/client-core';

export function activate(context: vscode.ExtensionContext) {
  const token = vscode.workspace.getConfiguration().get('osc-access-token') as string;
  if (!token) {
    console.error('Please set your OSC access token in your settings.');
    return;
  }
  const oscContext = new Context({ personalAccessToken: token });
  console.log('Congratulations, your OSC Architect chat extension is now active!');
  registerOscParticipant(context, oscContext);
}

export function deactivate() { }
