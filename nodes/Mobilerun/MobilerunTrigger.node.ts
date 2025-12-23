import { ApplicationError, IDataObject, IHookFunctions, INodeType, INodeTypeDescription, IWebhookFunctions, IWebhookResponseData, NodeConnectionTypes } from 'n8n-workflow';

export class MobilerunTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Mobilerun Trigger',
		name: 'mobilerunTrigger',
		group: ['trigger'],
		version: 1,
		icon: 'file:droidrun-logo.svg',
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Access the Mobilerun Cloud Trigger',
		defaults: {
			name: 'Mobilerun Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'mobilerunApi',
				required: true,
			},
		],
		webhooks: [{
			name: 'default',
			httpMethod: 'POST',
			path: 'webhooks',
			responseMode: 'onReceived'
		}],

		properties: [
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const staticData = this.getWorkflowStaticData('node');
				const webhookUrl = this.getNodeWebhookUrl('default');
				this.logger.debug("[MOBILERUN]checking if webhook exist", staticData)

				if (!staticData.hookId) return false

				try {
					const response = await this.helpers.httpRequestWithAuthentication.call(this, 'mobilerunApi', {
						method: 'GET',
						url: `https://api.mobilerun.ai/v1/hooks/${staticData.hookId}`,
						returnFullResponse: true,
					}) as { body?: { id: string; url: string, status?: number } };

					if (response?.body?.status && response.body?.status == 409) return true

					this.logger.debug(`[MOBILERUN]"response", ${response.body?.id} ${JSON.stringify(response)}`)

					return !!response?.body?.url && response.body?.url === webhookUrl;
				} catch (e: any) {
					const status = e?.statusCode ?? e?.response?.status;
					this.logger.error('Error', e)
					if (status === 409) return true;
					if (status === 404) return false;
					throw e;
				}

			},

			// Subscribe
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const staticData = this.getWorkflowStaticData('node');

				const body: IDataObject = {
					targetUrl: webhookUrl,
					service: 'n8n',
					events: ['created', 'running', 'paused', 'completed', 'failed', 'cancelled'],
				};

				try {
					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'mobilerunApi',
						{
							method: 'POST',
							url: 'https://api.mobilerun.ai/v1/hooks/subscribe',
							body,
							returnFullResponse: true,
						},
					) as {
						body?: {
							id?: string;
							subscribed?: boolean;
							status?: number;
						}
					};

					this.logger.debug("creating webhook response", response)

					if (response?.body?.status === 409) {
						this.logger.debug(JSON.stringify(response))
						throw new ApplicationError('Mobilerun subscribe: already exists.');
					}

					if (!response?.body?.id) {
						throw new ApplicationError('Mobilerun subscribe: Antwort enthält keine id.');
					}

					if (response?.body?.subscribed === false) {
						throw new ApplicationError('Mobilerun subscribe: subscription war nicht erfolgreich.');
					}

					this.logger.debug(`[MOBILERUN] setting hookId ${response?.body?.id}`)

					staticData.hookId = response.body.id;
					return true;
				} catch (e: any) {
					const status =
						e?.statusCode ??
						e?.response?.status ??
						e?.context?.data?.status ??
						Number(e?.httpCode);

					const detail = e?.context?.data?.detail ?? e?.response?.data?.detail;

					if (status === 409 && String(detail).includes('subscription already exists')) {
						return true;
					}

					throw e;
				}

			},

			// Unsubscribe
			async delete(this: IHookFunctions): Promise<boolean> {
				const staticData = this.getWorkflowStaticData('node');
				this.logger.debug(`[MOBILERUN] Deleteing webhook with id: ${staticData.hookId}`)

				if (!staticData.hookId) {
					return false;
				}

				try {
					await this.helpers.httpRequestWithAuthentication.call(
						this,
						'mobilerunApi',
						{
							method: 'POST',
							url: `https://api.mobilerun.ai/v1/hooks/${staticData.hookId}/unsubscribe`,
							returnFullResponse: true,
						},
					);
				} catch (error) {
				}

				delete staticData.hookId;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		try {
			this.logger.debug("[MOBILERUN] Received Webhook call")
			const bodyData = this.getBodyData();

			return {
				workflowData: [this.helpers.returnJsonArray(bodyData)],
			};
		} catch (error) {
			this.logger.error("[MOBILERUN] Webhook processing error", error);
			throw error;
		}
	}
};

