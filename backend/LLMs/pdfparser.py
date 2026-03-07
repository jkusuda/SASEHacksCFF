import json
import os
import pymupdf


def parse_pdf(pdf_path: str = None, output_path: str = None) -> dict:
    """Extract all text from a PDF and save it as a JSON file."""
    if pdf_path is None:
        pdf_path = os.path.join(os.path.dirname(__file__), "sample.pdf")
    if output_path is None:
        output_path = os.path.join(os.path.dirname(__file__), "contract.json")

    doc = pymupdf.open(pdf_path)

    pages = []
    full_text = ""
    for i, page in enumerate(doc):
        text = page.get_text()
        pages.append({"page": i + 1, "text": text})
        full_text += text + "\n"

    doc.close()

    result = {
        "source": os.path.basename(pdf_path),
        "total_pages": len(pages),
        "full_text": full_text.strip(),
        "pages": pages,
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    return result


if __name__ == "__main__":
    result = parse_pdf()
    print(f"Parsed {result['total_pages']} pages from {result['source']}")
    print(f"Saved to contract.json")
