import faiss
import numpy as np


class FAISSVectorStore:
    def __init__(self, vector_dim: int):
        self.index = faiss.IndexFlatL2(vector_dim)
        self.texts = []

    def add_vectors(self, vectors, texts):
        vectors = np.array(vectors).astype("float32")
        self.index.add(vectors)
        self.texts.extend(texts)

    def search(self, query_vector, k=3):
        query_vector = np.array([query_vector]).astype("float32")
        distances, indices = self.index.search(query_vector, k)

        results = []
        for idx in indices[0]:
            results.append(self.texts[idx])

        return results

    def save(self, path="faiss.index"):
        faiss.write_index(self.index, path)

    def load(self, path="faiss.index"):
        self.index = faiss.read_index(path)
