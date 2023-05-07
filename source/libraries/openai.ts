import {Configuration, OpenAIApi, CreateChatCompletionResponse} from 'openai';

export {CreateChatCompletionResponse};

const OPENAI_API_KEY = process.env['OPENAI_API_KEY'];
if (!OPENAI_API_KEY) {
	console.error('Missing environment variable "OPENAI_API_KEY"');
	process.exit(1);
}

const configuration = new Configuration({
	apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default openai;
