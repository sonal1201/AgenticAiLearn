from langchain_community.document_loaders import TextLoader

loader = TextLoader("text.txt")

document = loader.load()

print(document)