import os
import google.generativeai as genai


def translate_tos(tos_path: str = None) -> str:
    """Read a ToS file and return a casual, brainrot-flavored summary of red flags."""
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
        "You are a Gen-Z consumer advocate who explains Terms of Service red flags "
        "in a casual, humorous way using internet/brainrot slang (e.g. 'no cap', "
        "'lowkey', 'sus', 'rizz', 'aura', 'sigma', 'L', 'W', 'cooked', 'yapping'). "
        "Keep the brainrot subtle — sprinkle it in naturally, don't force it into every "
        "sentence. The goal is to be funny but still genuinely informative.\n\n"
        "Read the following Terms of Service find red flags about the ToS."
        "For each red flag, write a single casual sentence stating what "
        "is actually bad. There should be no explanations attached. Keep the total response concise "
        "There should be a max 5 red flags.\n\n"
        "Here is the Terms of Service:\n\n"
        f"{tos_text}"
    )

    response = model.generate_content(prompt)
    return response.text


if __name__ == "__main__":
    print(translate_tos())
