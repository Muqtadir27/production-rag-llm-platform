import json

docs = json.load(open('data/vector_index/documents.json'))
print(f'Total chunks: {len(docs)}')
print('\nFirst 15 chunks:')
for i in range(min(15, len(docs))):
    content = docs[i]['content']
    print(f'\n[{i}] ({len(content)} chars):')
    print(f'  "{content[:120]}"')

# Check for fragment chunks
print('\n\n=== FRAGMENT CHECK ===')
small_chunks = [d for d in docs if len(d['content']) < 50]
print(f'Small chunks (<50 chars): {len(small_chunks)}')
if small_chunks:
    print('\nExamples:')
    for i, d in enumerate(small_chunks[:5]):
        print(f'  "{d["content"]}"')
