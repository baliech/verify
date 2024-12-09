from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from kudra_cloud_client import KudraCloudClient
import os
import google.generativeai as genai
import tempfile
import shutil
import logging
from appwrite.client import Client
from appwrite.services.databases import Databases

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Allow CORS for the React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000"],  # Match your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini API
genai.configure(api_key="AIzaSyAg3u9n66EEG2_7BtLP7UQbKRtJSCvuJiI")
model = genai.GenerativeModel(model_name="gemini-pro")

# Initialize KudraCloudClient
kudraCloud = KudraCloudClient(token="1b412d10-0fea-4d99-bfb3-f7e5df249875")
project_run_id = "David/Invoice%20Extraction-17228469437846134/1b412d10-0fea-4d99-bfb3-f7e5df249875/MTI5MA=="

# Initialize Appwrite Client
client = Client()
client.set_endpoint("https://cloud.appwrite.io/v1")  # Appwrite endpoint
client.set_project("670a643c001fe74b48b8")  # Appwrite project ID
client.set_key("standard_59d858e4489630a4ce31cbe9b646b34a2f374eb0729756a568c9edca614d0e17a7af18b9714636ff4713f8cf5405dd98c72ccc829b0a3c4b8537b97505781ba727b1b7708bb098f8c6376fadba42bedd9bb21cc4206c5aec6eca5cbfe60c959b363be22ffa1ea4edf87bae310e81522914dd6490de2d950fb075423eb2177b8e")  # Appwrite API key
database = Databases(client)

# Extract file ID from the Appwrite image URL
def extract_file_id(image_url: str):
    match = image_url.split("/files/")[-1].split("/view")[0]
    if not match:
        raise ValueError("Invalid Appwrite URL: Could not extract fileId.")
    return match

# Extract text from uploaded file
def extract_text_from_file(uploaded_file: UploadFile):
    with tempfile.TemporaryDirectory() as temp_dir:
        file_path = os.path.join(temp_dir, uploaded_file.filename)
        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(uploaded_file.file, buffer)
            logger.info(f"File saved temporarily at {file_path}")

            # Analyze the document using KudraCloud
            result = kudraCloud.analyze_documents(files_dir=temp_dir, project_run_id=project_run_id)
            if result and result[0] and "text" in result[0]:
                return result[0]["text"]
            else:
                raise ValueError("Failed to extract text from the result.")
        except Exception as e:
            logger.error(f"Error extracting text: {str(e)}", exc_info=True)
            raise

# Analyze text function
def analyze_text(text, questions):
    responses = []
    for question in questions:
        validation_question = f"Based on the following text, answer the question: '{question}'. If the information is not found, clearly state 'Information not found'.\n\nText: {text}\n\nQuestion: {question}"
        try:
            response = model.generate_content(validation_question)
            answer = response.text.strip()
            status = "Found" if "information not found" not in answer.lower() else "Not-Found"
            responses.append({"question": question, "answer": answer, "status": status})
        except Exception as e:
            logger.error(f"Error generating response: {str(e)}", exc_info=True)
            responses.append({"question": question, "answer": "Error processing request", "status": "Error"})
    return responses

# Save results to Appwrite
def save_results_to_appwrite(hash_id, results, extracted_text):
    try:
        database_id = "670d8bc8002f74b172a8"  # Appwrite database ID
        collection_id = "6746ff3a00397d5d9924"  # Appwrite collection ID
        
        document_data = {
            "hash": hash_id,  # Use fileId as hash
            "name": None,
            "total": None,
            "invoice-number": None,
            "reference-number": None,
            "TCM": None
        }
        
        for result in results:
            if result["status"] == "Found":
                if "Name" in result["question"]:
                    document_data["name"] = result["answer"]
                elif "Total" in result["question"]:
                    document_data["total"] = result["answer"]
                elif "Invoice Number" in result["question"]:
                    document_data["invoice-number"] = result["answer"]
                elif "Reference Number" in result["question"]:
                    document_data["reference-number"] = result["answer"]
                elif "TCM" in result["question"]:
                    document_data["TCM"] = result["answer"]
        
        document = database.create_document(
            database_id,
            collection_id,
            "unique()",
            document_data
        )
        logger.info(f"Document created: {document}")
    except Exception as e:
        logger.error(f"Error saving results to Appwrite: {str(e)}", exc_info=True)
        raise

@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile = File(...), imageUrl: str = Form(...)):
    try:
        # Extract fileId from imageUrl
        hash_id = extract_file_id(imageUrl)
        logger.info(f"Extracted hash (fileId): {hash_id}")

        # Extract text from uploaded file
        extracted_text = extract_text_from_file(file)
        logger.info(f"Extracted text: {extracted_text[:100]}...")  # Log first 100 characters

        # Define your questions
        keywords = ["Name", "Total", "Invoice Number", "Date", "Reference Number", "TCM"]
        questions = [f"What is the {keyword}?" for keyword in keywords]

        # Analyze the extracted text
        responses = analyze_text(extracted_text, questions)
        logger.info(f"Analysis complete. Responses: {responses}")

        # Save results to Appwrite with hash
        save_results_to_appwrite(hash_id, responses, extracted_text)

        return {"hash": hash_id, "responses": responses}
    
    except Exception as e:
        logger.error(f"Error processing file: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.environ.get("PORT", 8000)), reload=True)

