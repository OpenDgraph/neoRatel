// Copyright 2017-2023 Dgraph Labs, Inc. and Contributors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { KeyCode, KeyMod } from 'monaco-editor';
import * as monaco from 'monaco-editor';

// Custom language configuration for GraphQL
export const dql: monaco.languages.LanguageConfiguration = {
  comments: {
    lineComment: "#"
  },
  brackets: [
    ["[", "]"] as monaco.languages.CharacterPair,
    ["{", "}"] as monaco.languages.CharacterPair,
    ["(", ")"] as monaco.languages.CharacterPair
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"""', close: '"""', notIn: ["string", "comment"] },
    { open: '"', close: '"', notIn: ["string", "comment"] }
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"""', close: '"""' },
    { open: '"', close: '"' }
  ],
  folding: {
    offSide: true
  }
};

export const TokensDefaults: monaco.languages.IMonarchLanguage = {
  defaultToken: "invalid",
  tokenPostfix: ".dql",
  keywords: [
    "null",
    "true",
    "false",
    "query",
    "mutation",
    "schema",
    "directive",
    "scalar",
    "type",
    "fragment",
  ],
  typeKeywords: ["Int", "Float", "String", "Boolean", "uid"],
  directiveLocations: [
    "SCHEMA",
  ],
  operators: ["=", "!", "?", ":", "&", "|"],
  symbols: /[=!?:&|]+/,
  escapes: /\\(?:["\\\/bfnrt]|u[0-9A-Fa-f]{4})/,
  tokenizer: {
    root: [
      [
        /[a-z_][\w$]*/,
        {
          cases: {
            "@keywords": "keyword",
            "@default": "key.identifier"
          }
        }
      ],
      [
        /[$][\w$]*/,
        {
          cases: {
            "@keywords": "keyword",
            "@default": "argument.identifier"
          }
        }
      ],
      [
        /[A-Z][\w\$]*/,
        {
          cases: {
            "@typeKeywords": "keyword",
            "@default": "type.identifier"
          }
        }
      ],
      { include: "@whitespace" },
      [/[{}()\[\]]/, "@brackets"],
      [/@symbols/, { cases: { "@operators": "operator", "@default": "" } }],
      [/@\s*[a-zA-Z_\$][\w\$]*/, { token: "annotation", log: "annotation token: $0" }],
      [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
      [/0[xX][0-9a-fA-F]+/, "number.hex"],
      [/\d+/, "number"],
      [/[;,.]/, "delimiter"],
      [/"""/, { token: "string", next: "@mlstring", nextEmbedded: "markdown" }],
      [/"([^"\\]|\\.)*$/, "string.invalid"],
      [/"/, { token: "string.quote", bracket: "@open", next: "@string" }]
    ],
    mlstring: [
      [/[^"]+/, "string"],
      ['"""', { token: "string", next: "@pop", nextEmbedded: "@pop" }]
    ],
    string: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }]
    ],
    whitespace: [
      [/[ \t\r\n]+/, ""],
      [/#.*$/, "comment"]
    ]
  }
};

export const DQLTheme: monaco.editor.IStandaloneThemeData = {
  base: 'vs-dark' as monaco.editor.BuiltinTheme,
  inherit: false,
  rules: [
    { token: 'schema', foreground: '008800' },
    { token: 'custom-info', foreground: '808080' },
    { token: 'custom-error', foreground: 'FF0000', fontStyle: 'bold' },
    { token: 'custom-notice', foreground: 'FFA500' },
    { token: 'custom-date', foreground: '008800' },
  ],
  colors: {
    'editor.foreground': '#D4D4D4',
    'editor.background': '#1E1E1E',
  },
};

// export const suggestions = 

// Register a new language
monaco.languages.register({ id: 'dql' });
monaco.languages.setLanguageConfiguration('dql', dql);
// Register a tokens provider for the language
monaco.languages.setMonarchTokensProvider('dql',
  TokensDefaults
);
// Define a new theme that contains only rules that match this language
monaco.editor.defineTheme('DQLTheme', DQLTheme);
// Register a completion item provider for the new language
monaco.languages.registerCompletionItemProvider('dql', {
  provideCompletionItems: (model: monaco.editor.ITextModel, position: monaco.Position) => {
    const word = model.getWordUntilPosition(position);
    const range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn
    };

    const keywords = ['allofterms', 'anyofterms', 'regexp', 'alloftext', 'le', 'ge', 'lt', 'gt', 'eq'];
    const keywords2 = ['uid', 'has', 'type'];
    const keywords3 = ['floor', 'ceil', 'ln', 'exp', 'sqrt', 'since', 'pow(a, b)', 'logbase(a,b)', 'cond(a, b, c)',
      'years', 'score', 'date', 'name@en', 'name@en:.', 'name@en:pl', 'cascade', 'name@en:pl:.', 'name@*', 'normalize', 'ignorereflex', 'recurse', '@en', '@fr', '@pt', '@ru'
    ];

    const keywordSuggestions = keywords.map(keyword => ({
      label: keyword,
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: '{ \n   query(func:' + keyword + '(${1:predicate}, "${2:value}") ) { \n      ${3:edge} \n    }' + '\n }',
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    }));

    const keywordSuggestions2 = keywords2.map(keyword => ({
      label: keyword,
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: '{ \n' + 'query(func:  ' + keyword + (keyword == 'uid' ? '(${1:0x1, 0x2}) ) { \n   ${2:edge} \n }' : '(${1:value}) { \n   ${2:edge} \n }') + '\n }',
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    }));

    const keywordSuggestions3 = keywords3.map(keyword => ({
      label: keyword,
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: keyword
    }));

    const otherSuggestions = [
      {
        label: 'sch',
        kind: monaco.languages.CompletionItemKind.Text,
        insertText: 'schema {}',
      },
      {
        label: '_*',
        kind: monaco.languages.CompletionItemKind.Text,
        insertText: 'expand(_all_)',
      },
      {
        label: 'expand',
        kind: monaco.languages.CompletionItemKind.Text,
        insertText: 'expand(${1:predicate})',
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'between',
        kind: monaco.languages.CompletionItemKind.Text,
        insertText: 'between(${1:DateTimePredicate}, "${2:1977-01-01}", ${3:"1977-12-31"}) { \n   ${4:edge} \n }',
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'edge',
        kind: monaco.languages.CompletionItemKind.Text,
        insertText: '${1:edge} {\n   ${2:edge}\n}',
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'alias',
        kind: monaco.languages.CompletionItemKind.Text,
        insertText: '${1:aliasName} : ${2:predicate}\n',
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'count',
        kind: monaco.languages.CompletionItemKind.Text,
        insertText: '${1:aliasName} : count(${2:predicate})\n',
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'val',
        kind: monaco.languages.CompletionItemKind.Text,
        insertText: '${1:aliasName} : ${2:max}(val(${3:varName}))\n',
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'variable',
        kind: monaco.languages.CompletionItemKind.Text,
        insertText: '${1:VarName} as ${2:predicate}\n',
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'min',
        kind: monaco.languages.CompletionItemKind.Text,
        insertText: '${1:VarName} as min(val(${2:varName}))\n',
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'avg',
        kind: monaco.languages.CompletionItemKind.Text,
        insertText: '${1:VarName} as avg(val(${2:varName}))\n',
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'sum',
        kind: monaco.languages.CompletionItemKind.Text,
        insertText: '${1:VarName} as sum(val(${2:varName}))\n',
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'math',
        kind: monaco.languages.CompletionItemKind.Text,
        insertText: '${1:VarName} as math(${2:predicate})\n',
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'orderasc',
        kind: monaco.languages.CompletionItemKind.Text,
        insertText: 'orderasc: ${1:predicate}',
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'orderdesc',
        kind: monaco.languages.CompletionItemKind.Text,
        insertText: 'orderdesc: ${1:predicate}',
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'first',
        kind: monaco.languages.CompletionItemKind.Text,
        insertText: 'first: ${1:number}',
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'Offset',
        kind: monaco.languages.CompletionItemKind.Text,
        insertText: 'first: ${1:number}, offset: ${2:number}',
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'After',
        kind: monaco.languages.CompletionItemKind.Text,
        insertText: 'first: ${1:number}, after: ${2:UID}',
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'near',
        kind: monaco.languages.CompletionItemKind.Text,
        insertText: '{\nquery(func: near(${1:predicate}, [${2:long}, ${3:lat}], ${4:distance}) ) {\n   expand(_all_)\n   }\n}',
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'nesting*',
        kind: monaco.languages.CompletionItemKind.Text,
        insertText: 'expand(_all_) {\n   expand(_all_)\n}',
      },
      {
        label: 'meBlock',
        kind: monaco.languages.CompletionItemKind.Text,
        insertText: 'me() {\n max(val(${1:varName}))\n}',
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'cascade',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: '@cascade(${1:predicate})',
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'recurse',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: '@recurse(depth:${1:number}, loop:${2:false})',
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'uid_in',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: '@filter(uid_in(${1:predicate}, ${2:0x1}))',
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'filter',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: '@filter(${1:condition})',
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'groupby',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: '@groupby(${1:predicate})',
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'facet',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: '@facets(${1:condition})',
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'func',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: [
          '{\n   q(func: ${1:eq}(${2:predicate}, "${3:value}")) {',
          '      expand(_all_)',
          '   }',
          '}',
        ].join('\n'),
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'shortest',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: [
          '{\n A as var(func: ${1:eq}(${2:predicate}, "${3:value}"))\n B as var(func: ${4:eq}(${5:predicate}, "${6:value}"))\n',
          'path as shortest(from: uid(A), to: uid(B), numpaths:${7:number}) {',
          '    friend',
          '   }',
          ' path(func: uid(path)) {',
          '    name',
          '  }',
          '}',
        ].join('\n'),
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
    ];
    const suggestions = [...keywordSuggestions, ...otherSuggestions, ...keywordSuggestions2, ...keywordSuggestions3]
      .map(suggestion => ({
        ...suggestion,
        range
      }));

    return { suggestions };
  }
});

export const func = () => null;
