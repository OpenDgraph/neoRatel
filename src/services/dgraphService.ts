import axios from "axios";
import { useDgraphConfigStore } from "../store/dgraphConfigStore";
import { useTabsStore } from "../store/tabsStore";
import { convertSchemaToText } from '../utils/schemaUtils';

interface IDgraphService {
  executeRequest: (endpoint: string, data: any, options: any, tabId: number) => Promise<any>;
  query: (q: any, tabId: number) => Promise<any>;
  mutate: (m: any, tabId: number) => Promise<any>;
  alter: (schema: string) => Promise<any>;
}

class DgraphService implements IDgraphService {
  private currentUrl: string | null = null;
  private aclToken: string | null = null;

  private sanitizeUrl(url: string): string {
    if (!/^[a-zA-Z][a-zA-Z+.-]*?:\/\//i.test(url)) {
      url = "http://" + url;
    }
    const parser = document.createElement("a");
    parser.href = url;
    return this.ensureNoSlash(
      `${parser.protocol}//${parser.host}${parser.pathname}`
    );
  }

  private ensureNoSlash(path: string): string {
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
            return;
          }
          response.data = await convertSchemaToText(response.data);
          useTabsStore.getState().updateTabContent(tabId, response.data, response.data);
        }
        else if (data.startsWith('schema {') && data.includes('#JSON') && response.data.data) {
          useTabsStore.getState().updateTabContent(tabId, response.data, response.data);
        } else {
          useTabsStore.getState().updateTabContent(tabId, data, response.data);
        }
      }

      return response.data;
    } catch (error) {
      console.error(`Error executing ${endpoint} on Dgraph:`, error);
      throw error;
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
    const { clusterUrl, slashApiKey, authToken } = useDgraphConfigStore.getState();
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
      throw error;
    }
  }
}

export default new DgraphService();
