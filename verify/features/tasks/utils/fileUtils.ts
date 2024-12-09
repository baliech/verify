// utils/fileUtils.ts

export const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const uploadResponse = await fetch("http://localhost:8000/uploadfile/", {
        method: "POST",
        body: formData,
      });
  
      if (!uploadResponse.ok) {
        throw new Error("Failed to upload the document");
      }
  
      const uploadResult = await uploadResponse.json();
      return uploadResult; // Return the result from upload (for processing)
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };
  
  export const handleDocumentProcessing = async (file: File, uploadResponse: any) => {
    try {
      const result = await fetch("http://localhost:8000/processdocument/", {
        method: "POST",
        body: JSON.stringify({
          fileId: uploadResponse.fileId, // This will be from your upload response
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!result.ok) {
        throw new Error("Failed to process the document");
      }
  
      const processedData = await result.json();
      return processedData; // Return the processed document result
    } catch (error) {
      console.error("Error processing document:", error);
      throw error;
    }
  };
  