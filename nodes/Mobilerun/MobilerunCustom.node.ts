/*
import {
	ApplicationError,
	INodeType,
	INodeTypeDescription,
	ISupplyDataFunctions,
	NodeConnectionTypes,
	SupplyData,
} from 'n8n-workflow';
/*

		WORK IN PROGRESS


import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { BaseMessage, AIMessage } from '@langchain/core/messages';
import { CallbackManagerForLLMRun } from '@langchain/core/callbacks/manager';
import { ChatResult } from '@langchain/core/outputs';
import { version } from '../../package.json';
import { getTaskResourceForOperation } from './properties/TaskApi.properties';

class CustomAIChatModel extends BaseChatModel {
	apiKey: string;
	apiUrl: string;
	model: string;
	temperature: number;
	maxTokens: number;
	outputSchema?: any;
	enableStructuredOutput: boolean;

	constructor(config: {
		apiKey: string;
		apiUrl: string;
		model: string;
		temperature?: number;
		maxTokens?: number;
		outputSchema?: any;
		enableStructuredOutput?: boolean;
		httpRequest?: any;
	}) {
		super({});
		this.apiKey = config.apiKey;
		this.apiUrl = config.apiUrl;
		this.model = config.model;
		this.temperature = config.temperature ?? 0.7;
		this.maxTokens = config.maxTokens ?? 1000;
		this.outputSchema = config.outputSchema;
		this.enableStructuredOutput = config.enableStructuredOutput ?? false;
		this.httpRequest = config.httpRequest;
	}

	_llmType(): string {
		return 'custom-ai-chat';
	}

	httpRequest?: any;

	async _generate(
		messages: BaseMessage[],
		options?: this['ParsedCallOptions'],
		runManager?: CallbackManagerForLLMRun,
	): Promise<ChatResult> {
		// Convert LangChain messages to API format
		const apiMessages = messages.map((msg) => {
			let role = 'user';
			if (msg._getType() === 'ai') role = 'assistant';
			if (msg._getType() === 'system') role = 'system';

			return {
				role,
				content: msg.content,
			};
		});

		// Build request body
		const requestBody: any = {
			model: this.model,
			messages: apiMessages,
			temperature: this.temperature,
			max_tokens: this.maxTokens,
		};

		// Add structured output if enabled
		if (this.enableStructuredOutput && this.outputSchema) {
			requestBody.response_format = {
				type: 'json_schema',
				json_schema: {
					name: 'structured_response',
					schema: this.outputSchema,
					strict: true,
				},
			};
		}

		// Make API request using httpRequest helper or axios
		let data;
		if (this.httpRequest) {
			// Use n8n's httpRequest helper if available
			data = await this.httpRequest({
				method: 'POST',
				url: this.apiUrl,
				headers: {
					'Authorization': `Bearer ${this.apiKey}`,
					'Content-Type': 'application/json',
				},
				body: requestBody,
			});
		} else {
			// Fallback to axios
			//const axios = require('axios');
			//const response = await axios.post(this.apiUrl, requestBody, {
			//	headers: {
			//		'Authorization': `Bearer ${this.apiKey}`,
			//		'Content-Type': 'application/json',
			//	},
			//});
			//data = response.data;
		}

		const content = data.choices[0]?.message?.content || '';

		return {
			generations: [
				{
					text: content,
					message: new AIMessage(content),
				},
			],
			llmOutput: {
				usage: data.usage,
			},
		};
	}
}
export class MobilerunCustom implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Mobilerunw Chat Model',
		name: 'mobilerunCustom',
		icon: 'file:droidrun-logo.svg',
		group: ['transform'],
		version: 1,
		description: 'Custom chat model for AI Agent with structured output',
		defaults: {
			name: 'Mobilerun Chat Model',
		},
		codex: {
			categories: ['AI'],
			subcategories: {
				AI: ['Language Models', 'Agents'],
			},
			resources: {
				primaryDocumentation: [
					{
						url: 'https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmchatopenai/',
					},
				],
			},
		},
		// eslint-disable-next-line n8n-nodes-base/node-class-description-inputs-wrong-regular-node
		inputs: [],
		// eslint-disable-next-line n8n-nodes-base/node-class-description-outputs-wrong
		outputs: [NodeConnectionTypes.AiLanguageModel],
		outputNames: ['Model'],
		credentials: [
			{
				name: 'mobilerunApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.mobilerun.ai/v1',
			headers: {
				'Content-Type': 'application/json',
				'User-Agent': `mobilerun-n8n/${version}`,
			},
			json: true,
		},
		properties: [...getTaskResourceForOperation()
		],
	};

	async supplyData(this: ISupplyDataFunctions, itemIndex: number): Promise<SupplyData> {
		// Get credentials
		const credentials = await this.getCredentials('mobilerunApi', itemIndex);

		// Get parameters
		const model = this.getNodeParameter('model', itemIndex) as string;
		const temperature = this.getNodeParameter('temperature', itemIndex) as number;
		const maxTokens = this.getNodeParameter('maxTokens', itemIndex) as number;
		const enableStructuredOutput = this.getNodeParameter('enableStructuredOutput', itemIndex) as boolean;
		const outputSchemaString = this.getNodeParameter('outputSchema', itemIndex, '{}') as string;
		// Parse output schema
		let outputSchema;
		if (enableStructuredOutput) {
			try {
				outputSchema = JSON.parse(outputSchemaString);
			} catch (error) {
				throw new ApplicationError(`Invalid JSON schema: ${error.message}`);
			}
		}

		// Create the custom chat model
		const chatModel = new CustomAIChatModel({
			apiKey: credentials.apiKey as string,
			apiUrl: credentials.apiUrl as string,
			model,
			temperature,
			maxTokens,
			outputSchema,
			enableStructuredOutput,
		});

		return {
			response: chatModel,
		};
	}
}
*/
