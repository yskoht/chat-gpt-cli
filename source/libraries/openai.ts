import {Configuration, OpenAIApi} from 'openai';

const OPENAI_API_KEY = process.env['OPENAI_API_KEY'];
if (!OPENAI_API_KEY) {
	throw new Error('Missing environment variable "OPENAI_API_KEY"');
}

const configuration = new Configuration({
	apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default openai;
