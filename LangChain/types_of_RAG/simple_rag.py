# system
import os
from dotenv import load_dotenv

# langchain
from langchain_community.document_loaders import WebBaseLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.runnables import RunnablePassthrough
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# llm
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_openai import ChatOpenAI

# vectorDB
from qdrant_client import QdrantClient
from langchain_qdrant import QdrantVectorStore


load_dotenv()


# ----Docs Loader----
loader = WebBaseLoader(web_path="https://www.educosys.com/course/genai")
docs = loader.load()

# ----Splitter-----
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
chunks = splitter.split_documents(docs)

# qdrant_client = QdrantClient(
#     url="https://f09a9709-0efe-4f54-b285-8527776761e9.eu-west-2-0.aws.cloud.qdrant.io:6333",
#     api_key=os.getenv("QDRANT_API_KEY"),
# )

# ----Embedding----
embedder = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-001",
    api_key=os.getenv("GOOGLE_API_KEY"),
)

# ----Vector Store---
vector_store = QdrantVectorStore.from_documents(
    documents=chunks,
    embedding=embedder,
    url="https://f09a9709-0efe-4f54-b285-8527776761e9.eu-west-2-0.aws.cloud.qdrant.io:6333",
    api_key=os.getenv("QDRANT_API_KEY"),
    collection_name="types-of-rag",
)

# ----Similarity Search----
search_result = vector_store.as_retriever()

print(type(search_result))


prompt = ChatPromptTemplate.from_template(
    """
You are an assistant for question-answering tasks.
Use the following retrieved context to answer the question.
If you don't know the answer, say you don't know.
Use at most three sentences.

Question: {question}
Context:
{context}

Answer:
"""
)


llm = ChatOpenAI(
    model="openai/gpt-oss-120b",
    api_key=os.environ.get("OPENAI_API_KEY"),
)

# ----Prompt----
prompt = ChatPromptTemplate.from_template(
    """
You are an assistant for question-answering tasks.
Use the following retrieved context to answer the question.
If you don't know the answer, say you don't know.
Use at most three sentences.

Question: {question}
Context:
{context}

Answer:
"""
)


def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)


rag_chain = (
    {
        "context": search_result | format_docs,
        "question": RunnablePassthrough(),
    }
    | prompt
    | llm
    | StrOutputParser()
)

response = rag_chain.invoke("what are the pre-requisites for these course")

print(response)
