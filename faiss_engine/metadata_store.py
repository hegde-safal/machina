class MetadataStore:
    def __init__(self):
        self.docs = {}  # doc_id → metadata
    
    def add_doc(self, doc_id, metadata):
        self.docs[doc_id] = metadata
    
    def get_doc(self, doc_id):
        return self.docs.get(doc_id)
    
    def list_docs(self):
        return list(self.docs.keys())
