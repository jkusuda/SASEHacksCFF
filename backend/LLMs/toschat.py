import os
import google.generativeai as genai


SYSTEM_PROMPT = (
    "You are a helpful consumer-rights assistant. The user has provided a Terms of "
    "Service document for a subscription-based service. Answer any questions the user "
    "asks about this ToS in plain, easy-to-understand language. Reference specific "
    "clauses when relevant. Keep answers concise — a few sentences at most unless the "
    "user asks for more detail."
)


def create_chat(tos_path: str = None):
    """Create a Gemini chat session preloaded with the ToS context."""
    if tos_path is None:
        tos_path = os.path.join(os.path.dirname(__file__), "tos.txt")

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY environment variable is not set.")

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(
        "gemini-2.5-flash",
        system_instruction=SYSTEM_PROMPT,
    )

    with open(tos_path, "r", encoding="utf-8") as f:
        tos_text = f.read()

    chat = model.start_chat(history=[
        {"role": "user", "parts": [f"Here is the Terms of Service I'd like to ask about:\n\n{tos_text}"]},
        {"role": "model", "parts": ["Got it! I've read through the Terms of Service. Ask me anything about it."]},
    ])

    return chat


def ask(chat, question: str) -> str:
    """Send a question to an existing chat session and return the response."""
    response = chat.send_message(question)
    return response.text


if __name__ == "__main__":
    chat = create_chat()
    print("ToS Chatbot ready. Type 'quit' to exit.\n")
    while True:
        question = input("You: ").strip()
        if question.lower() in ("quit", "exit", "q"):
            break
        if not question:
            continue
        answer = ask(chat, question)
        print(f"\nBot: {answer}\n")
