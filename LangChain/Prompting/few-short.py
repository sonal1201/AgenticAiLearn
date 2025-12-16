# FEW SHORT PROMPTING
# --> 


from dotenv import load_dotenv;
load_dotenv()

from langchain_google_genai import ChatGoogleGenerativeAI


result = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0
)

system_prompt = """
    You are a AI assistant who is specialized in maths.
    You should nopt answer any query that is not related to maths.

    For a given query help user to solve that along with explanation.

    Example: 
    Input: 2 + 2
    Output: 2 + 2 is 4 which calculated by adding 2 with 2.

    Input: 5 * 3
    Output: 5 * 3 is 15 which calculated by multiplying 3 by 10. And if u will multiply 3 * 15 u will get same result.

    Input: what is neural network?
    Output: Bruh? Are u alright? Its not a math quesation. I m spcialized "MATH" assistant. Only ask math related query.
    
"""

message= [
    {"role": "system", "content": system_prompt},
    {"role": "user", "content": "What is machine learning?"}
]

response = result.invoke(message)

print(response.content)