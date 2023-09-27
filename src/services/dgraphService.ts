import axios from "axios";
import { useDgraphConfigStore } from "../store/dgraphConfigStore";
import { useTabsStore } from "../store/tabsStore";

interface SchemaObj {
  data: {
    schema: any;
    types: any;
  };
}

async function convertSchemaToText(schemaObj: SchemaObj) {
  const { schema, types } = schemaObj.data;

  // Group predicates by type
  const predicatesByType: { [key: string]: any[] } = {};
  for (const predicate of schema) {
    if (!predicate.predicate.startsWith('dgraph.')) {
      if (!predicatesByType[predicate.type]) {
        predicatesByType[predicate.type] = [];
      }
      predicatesByType[predicate.type].push(predicate);
    }
  }

  let schemaText = '';
  // Iterate through each type
  for (const type in predicatesByType) {
    schemaText += `# ${type.toUpperCase()} Predicates\n`;
    for (const predicate of predicatesByType[type]) {
      schemaText += `    <${predicate.predicate}>: `;
      if (predicate.list) {
        schemaText += `[${predicate.type}]`;
      } else {
        schemaText += predicate.type;
      }
      if (predicate.index) {
        schemaText += ' @index(' + predicate.tokenizer.join(", ") + ')';
      }
      if (predicate.reverse) {
        schemaText += ' @reverse';
      }
      schemaText += ' .\n';
    }
    schemaText += '\n';
  }

  if (schemaText !== '') {
    schemaText += '# Types\n';
  } else if (schemaText === '') {
    schemaText += '# No predicates found || Looks like a clean cluster \n';
  }
  
  for (const type of types) {
    if (!type.name.startsWith('dgraph.')) {
      schemaText += `type <${type.name}> {\n`;
      for (const field of type.fields) {
        if (!field.name.startsWith('dgraph.')) {
          schemaText += `  ${field.name}\n`;
        }
      }
      schemaText += '}\n\n';
    }
  }

  return schemaText;
}

interface IDgraphService {
  aclToken: string | null;
  currentUrl: string | null;
  sanitizeUrl(url: string): string;
  ensureNoSlash(path: string): string;
  executeRequest(endpoint: string, data: any, options: any, tabId: number): Promise<any>;
  query(q: any, tabId: number): Promise<any>;
  mutate(m: any, tabId: number): Promise<any>;
  alter(schema: string): Promise<any>;
}

class DgraphService implements IDgraphService {
  aclToken: string | null;
  currentUrl: string | null;

  constructor() {
    this.currentUrl = null;
    this.aclToken = null;
  }

  sanitizeUrl(url: string) {
    // Add http if a scheme is not specified.
    if (!/^[a-zA-Z][a-zA-Z+.-]*?:\/\//i.test(url)) {
      url = "http://" + url;
    }
    const parser = document.createElement("a");
    parser.href = url;
    return this.ensureNoSlash(
      `${parser.protocol}//${parser.host}${parser.pathname}`
    );
  }

  ensureNoSlash(path: string) {
    if (path.endsWith("/")) {
      return path.substring(0, path.length - 1);
    }
    return path;
  }

  async executeRequest(endpoint: string, data: any, options: any, tabId: number) {
    const { clusterUrl, slashApiKey, authToken, aclToken } = useDgraphConfigStore.getState();
    if (clusterUrl !== this.currentUrl) {
      this.currentUrl = this.sanitizeUrl(clusterUrl);
    }
    if (aclToken !== this.aclToken) {
      this.aclToken = aclToken;
    }
    try {
      const config = {
        headers: {
          "X-Auth-Token": slashApiKey,
          "X-Dgraph-AuthToken": authToken,
          "Content-Type": "application/dql",
          "X-Dgraph-AccessToken": this.aclToken,
        },
        params: options,
      };

      const response = await axios.post(this.currentUrl + "/" + endpoint, data, config);

      if (endpoint === "query") {
        if (data.startsWith('schema {') && data.endsWith('}')) {
          if (!response.data.data) {
            console.log(" return");
            return;
          }
          console.log(" convertSchemaToText");
          response.data = await convertSchemaToText(response.data);
          useTabsStore.getState().updateTabContent(tabId, response.data, response.data);
        } else {
          useTabsStore.getState().updateTabContent(tabId, data, response.data);
        }
      }

      return response.data;
    } catch (error) {
      console.error(`Error executing ${endpoint} on Dgraph:`, error);
    }
  }

  async query(q: any, tabId: number) {
    const options = {
      debug: q.debug,
      timeout: q.timeout,
      startTs: q.startTs,
      hash: q.hash,
      be: q.be,
      ro: q.ro,
    };

    return this.executeRequest("query", q, options, tabId);
  }

  async mutate(m: any, tabId: number) {
    const options = {
      commitNow: m.commitNow,
      startTs: m.startTs,
    };

    return this.executeRequest("mutate", { setNquads: m.mutation }, options, tabId);
  }


  async alter(schema: string) {
    const { clusterUrl, slashApiKey, authToken } =
      useDgraphConfigStore.getState();
    if (clusterUrl !== this.currentUrl) {
      this.currentUrl = this.sanitizeUrl(clusterUrl);
    }
    try {
      const response = await axios.post(
        this.currentUrl + "/alter",
        { schema },
        {
          headers: {
            "X-Auth-Token": slashApiKey,
            "X-Dgraph-AuthToken": authToken,
            "Content-Type": "application/dql",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error altering schema on Dgraph:", error);
    }
  }

}

export default new DgraphService();
