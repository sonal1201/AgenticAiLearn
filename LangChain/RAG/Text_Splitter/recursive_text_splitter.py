"""
(MOSTLY USED TEXT SPLITTER)
The recursive approach:
“Try to split nicely first. If that fails, get rougher.”

Why RecursiveCharacterTextSplitter?
Because it tries separators in order, from most meaningful to least meaningful:

Typical order:
Paragraph breaks (\n\n)
Line breaks (\n)
Sentences
Words
Characters (last resort, no mercy)

It keeps trying until the chunk fits your size limit.
"""

from langchain_text_splitters import RecursiveCharacterTextSplitter

text = """
Document Loader is one of the components of the LangChain framework. It is responsible for loading documents from different sources. The documents are loaded in the form of Document objects that can be easily used by other components like LLMs, Text Splitters, Vector Stores, etc.
The data sources could be PDFs, Word Files, Web Pages, CSV Files, etc. There is a separate class to load data from these documents.
Document loaders play a foundational role in Retrieval-Augmented Generation (RAG). In RAG, we provide LLM with external data source to produce responses. Document loaders help in loading data into a standardized format Document object. We will be studying RAG concepts in the upcoming articles of this series, once we are familiar with all components of LangChain.
Types of Document Loaders
Depending upon the types of data sources, we have different classes to load documents. For example PDF, word, CSV files, web pages, etc. But these classes share a common working pattern.
"""

spliter = RecursiveCharacterTextSplitter(chunk_size=100, chunk_overlap=0)

chunk = spliter.split_text(text)

print(f"total chunking -> {len(chunk)}")

for c in chunk:
    print(f"{len(c)} ---> {c} \n")
