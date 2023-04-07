<br />

<h2 align="center">

[Rompt.ai](https://rompt.ai) Node.js Library

</h2>

<h4 align="center">
    <img alt="Snyk vulnerabilities" src="https://shields.io/snyk/vulnerabilities/github/rompt-ai/rompt-node?style=flat-square" />
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/rompt-ai/rompt-node?style=flat-square">
    <img alt="GitHub top language" src="https://img.shields.io/bundlephobia/minzip/@romptai/client?style=flat-square">
</h4>

<hr />

<br />

Rompt streamlines your workflow, improves collaboration, enhances GPT model performance, and provides seamless integration with its CLI tool and output format support.


Features
--------

*   Version control and changelog on prompts
*   Generate prompts from template strings
*   Pull prompts from Rompt into your codebase


Installation
------------

Pull your prompts into your codebase using the CLI:

```bash
npx @romptai/cli pull --token {YOUR_TOKEN}
```

Install the client library:

```bash
npm install @romptai/client
```


Usage
-----

To use the library, you'll first need to import it:

```ts
import { generate } from '@romptai/client';

const romptData = generate("your-prompt-name", {
  NAME: "Michael",
  DIRECTION: "Generate a Tweet",
  SENTIMENT: `Make the Tweet about ${myOtherVariable}`
});

const { prompt } = romptData;
// Your result is now in the prompt variable
```


Track History
-------------

```ts
import { generate, track } from '@rompt/client';

// ...continued from above

track(romptData)

// Your GPT responses can be included; example with OpenAI:

const gptResponse = await openai.createCompletion({
  prompt,
  //...
});

track(romptData, gptResponse.data)
```


Documentation
-------------

For detailed documentation, including API references and more examples, please visit the [the Rompt.ai website](https://rompt.ai/docs).


Contributing
------------

We welcome contributions to the Rompt Node.js library. If you'd like to contribute, please submit a pull request on GitHub.


License
-------

This project is licensed under the MIT License. For more information, please see the [LICENSE](https://github.com/your_github_username/rompt-/blob/main/LICENSE) file.