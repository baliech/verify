import { filesAppwrite } from "./type";
import { Query } from "node-appwrite";

const { databases, config } = filesAppwrite;

export async function deleteDocuments(imageUrls: string[]): Promise<void> {
    const validUrls = imageUrls.filter(url => url && url.trim() !== '');
    
    if (validUrls.length > 0) {
      try {
        const documentsToDelete = await Promise.all(
          validUrls.map(async (url) => {
            const searchResult = await databases.listDocuments(
              config.databaseId, 
              config.collectionId, 
              [
                Query.equal('imageUrl', url),
                Query.limit(1)
              ]
            );
  
            return searchResult.documents[0]?.$id;
          })
        );
  
        const validDocumentIds = documentsToDelete.filter(Boolean);
  
        if (validDocumentIds.length > 0) {
          await Promise.all(
            validDocumentIds.map(id => 
              databases.deleteDocument(config.databaseId, config.collectionId, id)
            )
          );
        }
      } catch (error) {
        console.error('Delete documents error:', error);
        throw error;
      }
    }
  }