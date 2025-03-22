import { ChatClient } from '@osaas/client-ai';
import { Context } from '@osaas/client-core';
import * as vscode from 'vscode';

const OSC_PARTICIPANT_ID = 'chat.osc-architect';

export function registerOscParticipant(context: vscode.ExtensionContext, oscContext: Context) {
  const handler: vscode.ChatRequestHandler = async (
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
  ) => {
    await oscAi.init();

    const oscAiResponse = await oscAi.sendChat(`When answering me provide code examples for Javascript client SDK. `+ request.prompt);

    const prompt = `Use this response from the Open Source Cloud platform and add code examples.` + oscAiResponse.message;
    const messages = [vscode.LanguageModelChatMessage.User(prompt)];
    messages.push(vscode.LanguageModelChatMessage.User(oscAiResponse.message));
    const chatResponse = await request.model.sendRequest(messages, {}, token);
    for await (const fragment of chatResponse.text) {
      stream.markdown(fragment);
    }
    return;
  };

  const oscAi = new ChatClient({ context: oscContext });
  const architect = vscode.chat.createChatParticipant(OSC_PARTICIPANT_ID, handler);
  architect.iconPath = vscode.Uri.joinPath(context.extensionUri, 'osc.png');
};
