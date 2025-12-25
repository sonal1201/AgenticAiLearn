'''
Text splitters break large docs into smaller chunks that will be retrievable
individually and fit within model context window limit.
LLMS can handle effectively 

Ways of TEXT SPLITTER
 - Text based splitter: Spliting by fixed token or char.
 - Text struture splitter:  RecusiveCharTextSplitter paragraph->linebreak->sentence->word->char
 - Docs struture splitter: used to split docs which contain html,markdown,code text.
 - Sementic meaning based splitter(still in experiment): Here we chunk the text/token based on the sementic meaning.
'''

from langchain_text_splitters import CharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader


loader = PyPDFLoader("Reportfile.pdf")

docs = loader.load()

splitter = CharacterTextSplitter(
    chunk_size = 500,
    chunk_overlap = 0,
    separator =''
)
# text split 
# result = splitter.split_text(docs)

# docs split
result = splitter.split_documents(docs)

print(result[4].page_content)
