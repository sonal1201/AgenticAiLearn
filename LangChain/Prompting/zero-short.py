# Zero short Prompting
# --> The model is given  a direct question or a task without any prior example

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0
)

result = model.invoke("Why is the sky blue?")

print(result.content)
