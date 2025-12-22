# Text Loader -> load txt file
# Pdf Loader -> load pdf file
# Directory Loader -> allow mutliple documents from directory.
# WebBased Loader -> used to load and extext content from web page. It uses beautiful soup to parse HTML and extract visable text.
# CSV Loader -> load csv file (one per row) as document object

'''
docs.load() 
    - Eager Loading (Load everything at once)
    - Return a list of Document Object
    - Load all document immediately into memory
    Best when:
      - The number of documents are less or small.
      - You want everything to load at once
'''

'''
docs.lazy_load()
    - Lazy Loading (Load on demands)
    - Returns a "generator" of Documents object
    - Documents are not all loaded at once. They are fetched once at a time as needed.
    Best when: 
      - You are dealing with large documents or lots of files.
      - You want to stream processing (eg - chunking, embedding) without losing the memory.
'''

 