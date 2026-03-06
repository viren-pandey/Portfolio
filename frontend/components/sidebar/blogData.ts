export interface Blog {
  id: string;
  title: string;
  description: string;
  readTime: string;
  date: string;
  permalink: string;
  tag: string;
}

export interface TagData {
  id: string;
  label: string;
  blogs: Blog[];
}

export const blogData: TagData[] = [
  {
    id: 'react-native',
    label: 'React Native',
    blogs: [
      {
        id: 'rn-1',
        title: 'Getting Started with React Native in 2026',
        description:
          'A comprehensive guide to building your first mobile app with React Native, covering setup, navigation, and state management.',
        readTime: '8 min read',
        date: '2026-02-15',
        permalink: 'getting-started-react-native-2026',
        tag: 'React Native',
      },
      {
        id: 'rn-2',
        title: 'React Native vs Flutter: Which to Choose?',
        description:
          'An in-depth comparison of React Native and Flutter for cross-platform mobile development, with real-world performance benchmarks.',
        readTime: '6 min read',
        date: '2026-01-20',
        permalink: 'react-native-vs-flutter',
        tag: 'React Native',
      },
      {
        id: 'rn-3',
        title: 'Optimizing React Native Performance',
        description:
          'Learn proven techniques to reduce jank, optimize renders, and build buttery smooth React Native apps using memoization and native modules.',
        readTime: '10 min read',
        date: '2025-12-10',
        permalink: 'optimizing-react-native-performance',
        tag: 'React Native',
      },
    ],
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    blogs: [
      {
        id: 'js-1',
        title: 'Closures Explained Once and For All',
        description:
          'Master JavaScript closures with clear examples, practical use cases, and common pitfalls explained step by step.',
        readTime: '5 min read',
        date: '2026-02-28',
        permalink: 'javascript-closures-explained',
        tag: 'JavaScript',
      },
      {
        id: 'js-2',
        title: 'Async/Await Patterns You Should Know',
        description:
          'Beyond the basics: advanced async patterns including parallel execution, error boundaries, and cancellation in modern JavaScript.',
        readTime: '7 min read',
        date: '2026-01-10',
        permalink: 'async-await-patterns-javascript',
        tag: 'JavaScript',
      },
      {
        id: 'js-3',
        title: 'JavaScript Proxy & Reflect: Hidden Power',
        description:
          'Explore the underused Proxy and Reflect APIs to build reactive systems, validation layers, and elegant abstractions.',
        readTime: '9 min read',
        date: '2025-11-22',
        permalink: 'javascript-proxy-reflect',
        tag: 'JavaScript',
      },
    ],
  },
  {
    id: 'aiml',
    label: 'AIML',
    blogs: [
      {
        id: 'ai-1',
        title: 'The Rise of Claude: How AI is Eating the Job Market',
        description:
          "Anthropic's Claude is silently reshaping industries. Here's what developers, writers, and knowledge workers need to know.",
        readTime: '12 min read',
        date: '2026-03-01',
        permalink:
          'the-rise-of-claude-anthropic-how-ai-is-silently-eating-the-job-market',
        tag: 'AIML',
      },
      {
        id: 'ai-2',
        title: 'Building a RAG System from Scratch',
        description:
          'Step-by-step guide to building a Retrieval-Augmented Generation pipeline with LangChain, embeddings, and vector databases.',
        readTime: '15 min read',
        date: '2026-02-10',
        permalink: 'building-rag-system-from-scratch',
        tag: 'AIML',
      },
      {
        id: 'ai-3',
        title: 'Fine-tuning LLMs on Custom Data',
        description:
          'A practical walkthrough of fine-tuning open-source large language models on domain-specific datasets using LoRA and QLoRA.',
        readTime: '11 min read',
        date: '2026-01-05',
        permalink: 'fine-tuning-llms-custom-data',
        tag: 'AIML',
      },
    ],
  },
  {
    id: 'express',
    label: 'Express.js',
    blogs: [
      {
        id: 'ex-1',
        title: 'Building REST APIs with Express & TypeScript',
        description:
          'A battle-tested boilerplate for production Express APIs with TypeScript, Zod validation, and structured error handling.',
        readTime: '8 min read',
        date: '2026-02-20',
        permalink: 'react-native-javascript-express-rest-api-guide',
        tag: 'Express.js',
      },
      {
        id: 'ex-2',
        title: 'Express Middleware Deep Dive',
        description:
          'Understand how Express middleware chains work under the hood, and build your own logging, auth, and rate-limiting middleware.',
        readTime: '6 min read',
        date: '2026-01-15',
        permalink: 'express-middleware-deep-dive',
        tag: 'Express.js',
      },
      {
        id: 'ex-3',
        title: 'Securing Express APIs: OWASP Top 10',
        description:
          'Practical security hardening for Express.js — helmet, CORS, rate limiting, input sanitization, and JWT best practices.',
        readTime: '9 min read',
        date: '2025-12-20',
        permalink: 'securing-express-apis-owasp',
        tag: 'Express.js',
      },
    ],
  },
  {
    id: 'rest-api',
    label: 'REST API',
    blogs: [
      {
        id: 'rest-1',
        title: 'REST API Design: Best Practices in 2026',
        description:
          'Versioning, pagination, error codes, HATEOAS, and the naming conventions that separate great APIs from mediocre ones.',
        readTime: '7 min read',
        date: '2026-02-25',
        permalink: 'rest-api-design-best-practices-2026',
        tag: 'REST API',
      },
      {
        id: 'rest-2',
        title: 'API Rate Limiting: Strategies & Implementation',
        description:
          'Token bucket, sliding window, fixed window — implement robust rate limiting the right way with Redis and Express.',
        readTime: '8 min read',
        date: '2026-01-30',
        permalink: 'api-rate-limiting-strategies',
        tag: 'REST API',
      },
      {
        id: 'rest-3',
        title: 'OpenAPI & Swagger: Document Your API Like a Pro',
        description:
          'Generate beautiful, interactive API docs automatically from your Express routes using OpenAPI 3.1 and Swagger UI.',
        readTime: '5 min read',
        date: '2025-12-15',
        permalink: 'openapi-swagger-document-api',
        tag: 'REST API',
      },
    ],
  },
];
