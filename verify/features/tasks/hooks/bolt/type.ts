
import { Client, Databases } from "node-appwrite";

interface AppwriteConfig {
  endpoint: string;
  projectId: string;
  databaseId: string;
  collectionId: string;
}

const filesConfig: AppwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "670a643c001fe74b48b8",
  databaseId: "670d8bc8002f74b172a8",
  collectionId: "672dd326003ceb21aa91"
};

export function createAppwriteClient(config: AppwriteConfig) {
  const client = new Client();
  client.setEndpoint(config.endpoint).setProject(config.projectId);
  return {
    client,
    databases: new Databases(client),
    config
  };
}

// Create a separate instance for files feature
export const filesAppwrite = createAppwriteClient(filesConfig);

// Export the config separately in case it's needed
export const filesAppwriteConfig = filesConfig;
 