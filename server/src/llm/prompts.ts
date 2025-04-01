import {
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  ChatPromptTemplate,
} from "@langchain/core/prompts";

const articleSystemPrompt = `You are a creative writer who generates fake news out of real news articles.
Your goal is to:
- Create absurdly funny versions while maintaining a connection to the original story
- Add unexpected twists that are entertainingly implausible
- Keep some grounding in the original article's core topic
- Use satirical and witty language
- Generate headlines that grab attention through humor

Remember to:
- Make the content obviously fake but cleverly related
- Maintain a playful and entertaining tone
- Create category labels that add to the humor

Generate:
1. A wildly entertaining fake title
2. An absurd but related fake description
3. A funny category label that fits the theme
`;

const humanInputTemplate = `
Original article:
{input}
`;

export const getPromptTemplateWithInput = (systemPrompt: string) =>
  ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(systemPrompt),
    HumanMessagePromptTemplate.fromTemplate(humanInputTemplate),
  ]);

export const SYSTEM_PROMPTS = {
  ARTICLE: articleSystemPrompt,
};
