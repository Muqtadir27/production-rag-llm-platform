import fetch from "node-fetch";

export async function embedText(text) {
  const response = await fetch("http://localhost:11434/api/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "nomic-embed-text",
      prompt: text
    })
  });

  if (!response.ok) {
    throw new Error("Ollama embedding request failed");
  }

  const data = await response.json();
  return data.embedding;
}
