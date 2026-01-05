from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader, TextLoader


def load_documents_from_folder(folder_path: str):
    documents = []
    folder = Path(folder_path)

    for file in folder.iterdir():
        if file.suffix.lower() == ".pdf":
            loader = PyPDFLoader(str(file))
            documents.extend(loader.load())

        elif file.suffix.lower() == ".txt":
            loader = TextLoader(str(file))
            documents.extend(loader.load())

    return documents


print("document_loader loaded successfully")
