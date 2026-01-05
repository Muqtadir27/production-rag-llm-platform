import numpy as np


def cosine_similarity(vec1, vec2):
    return np.dot(vec1, vec2) / (
        np.linalg.norm(vec1) * np.linalg.norm(vec2)
    )


def find_top_k(query_vector, vectors, texts, k=3):
    scores = []

    for i, vector in enumerate(vectors):
        score = cosine_similarity(query_vector, vector)
        scores.append((score, texts[i]))

    scores.sort(reverse=True, key=lambda x: x[0])
    return scores[:k]
