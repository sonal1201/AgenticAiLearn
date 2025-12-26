"""
A retriver is a component in a langchain that fetches relavent data from a data source in response to a query;

There are multiple retrivers
- Wikipedia Retriever -> A Wikipedia Retriever is a retriever that queries the Wikipedia API to fetch relevant content for
a given query

- Vector Store Retriever -> search and fetch documents from a vector store based on semantic similarity using vector embeddings.

- Maximum Marginal Relevance(MMR) -> designed to reduce redundancy in the retrieved results

- Multi Query Retriever -> use llm then generate mutiple query then perform retrivals.

- Contextual Compression Retriever -> The Contextual Compression Retriever in LangChain is an advanced retriever that improves
retrieval quality by compressing documents after retrieval — keeping only the relevant
content based on the user's query.

- More Retrievers
"""

from langchain_community.retrievers import WikipediaRetriever
import wikipedia

# English domain
wikipedia.set_lang("en")

# top_k_results -> it tell give me top 2 result only.
retriever = WikipediaRetriever(top_k_results=2)

query = "When did India win its first Cricket World Cup?"

docs = retriever.invoke(query)

for i, doc in enumerate(docs, 1):
    print(f"\n--- Result {i} ---")
    print(doc.page_content)
