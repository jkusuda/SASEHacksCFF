import os
import google.generativeai as genai


def analyze_tos(tos_path: str = None) -> str:
    """Read a Terms of Service file and return a plain-language analysis using Gemini."""
    if tos_path is None:
        tos_path = os.path.join(os.path.dirname(__file__), "tos.txt")

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY environment variable is not set.")

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.5-flash")

    with open(tos_path, "r", encoding="utf-8") as f:
        tos_text = f.read()

    prompt = (
        "You are a consumer-rights analyst. A user has shared the Terms of Service "
        "for a subscription-based service. Analyze the document and produce a clear, "
        "structured report that includes:\n"
        "IMPORTANT scoring guidance: Use the following scale for all three scores.\n"
        "- 80-100: Gold standard for industry ToS. May have minor debatable points but "
        "nothing blatantly predatory on consumers.\n"
        "- 50-79: There is at least one clause that is a point of contention or concern "
        "for consumers.\n"
        "- 30-49: There is at least one clause that is blatantly wrong or predatory.\n"
        "- 0-29: There are multiple clauses that are blatantly wrong or predatory.\n\n"
        "1. One sentence per thing it finds wrong. The max number of things it finds wrong should be 5, with the most important being listed first.\n"
        "2. Three numerical scores from 0 to 100:\n"
        "   - Data Privacy Score: How well the contract protects the user's personal data "
        "and digital privacy (0 = does not protect user data at all, 100 = excellent user "
        "privacy protections).\n"
        "   - Integrity Score: How deceitful or misleading the contract is "
        "(100 = very trustworthy and transparent, 0 = very deceitful and misleading).\n"
        "   - Consumer Fairness Score: How balanced the contract is between the provider "
        "and the consumer (100 = very balanced or favorable to the consumer, 0 = entirely skewed toward the provider).\n"
        "   For each score, provide a brief justification.\n\n"
        "Here is the Terms of Service:\n\n"
        f"{tos_text}"
    )

    response = model.generate_content(prompt)
    return response.text


if __name__ == "__main__":
    print(analyze_tos())
