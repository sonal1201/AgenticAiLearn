from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_community.document_loaders import TextLoader
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
import os


load_dotenv()

model = ChatOpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
    base_url="https://api.groq.com/openai/v1",
    model="openai/gpt-oss-20b"
)

prompt = PromptTemplate(
    template = "Write a 5 line summary for the following \n{text}",
    input_variables = ['text']
)

parser = StrOutputParser()
loader = TextLoader("text.txt")

document = loader.load()

print(document[0].page_content)
print("----------This is the Summary-----------")

chain = prompt | model | parser

res = chain.invoke({'text': document[0].page_content})

print(res)