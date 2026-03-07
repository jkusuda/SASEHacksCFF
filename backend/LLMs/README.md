# LLM Scripts for Terms of Service Analysis

This folder contains Python scripts that use the Google Gemini API to analyze Terms of Service (ToS) documents.

## Prerequisites

- Python 3.8+
- Google Gemini API key (free tier available)

## Setup

### 1. Get a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click "Get API Key"
3. Select "Create API Key in new project" or use an existing project
4. Copy your API key

### 2. Set Environment Variable

#### On Windows (Command Prompt/PowerShell):

**Command Prompt:**
```cmd
set GEMINI_API_KEY=your_api_key_here
```

**PowerShell:**
```powershell
$env:GEMINI_API_KEY="your_api_key_here"
```

**Persistent (permanent for user):**
```powershell
[Environment]::SetEnvironmentVariable("GEMINI_API_KEY", "your_api_key_here", "User")
```

#### On macOS/Linux:

```bash
export GEMINI_API_KEY="your_api_key_here"
```

**Persistent (add to `~/.bashrc` or `~/.zshrc`):**
```bash
echo 'export GEMINI_API_KEY="your_api_key_here"' >> ~/.bashrc
source ~/.bashrc
```

### 3. Install Dependencies

From the project root directory, install required packages:

```bash
pip install -r backend/requirements.txt
```

The key package is `google-generativeai`:
```bash
pip install google-generativeai
```

## Usage

### Script 1: `tosreport.py` - Structured Analysis Report

Analyzes a Terms of Service document and provides a detailed report with scores.

**Features:**
- Identifies up to 5 key issues found in the ToS
- Provides three numerical scores (0-100):
  - **Data Privacy Score**: How well user data is protected
  - **Integrity Score**: How trustworthy and transparent the contract is
  - **Consumer Fairness Score**: How balanced the contract is between provider and consumer
- Includes justifications for each score

**Run from project root:**
```bash
python backend/LLMs/tosreport.py
```

This will analyze the default `tos.txt` file in the LLMs folder.

**To analyze a custom ToS file:**
```python
from backend.LLMs.tosreport import analyze_tos

result = analyze_tos("path/to/your/tos.txt")
print(result)
```

### Script 2: `tostranslate.py` - Casual Gen-Z Summary

Summarizes ToS red flags in casual, humorous Gen-Z/brainrot style language while staying informative.

**Features:**
- Identifies up to 5 red flags in the ToS
- Uses casual internet slang ('no cap', 'sus', 'cooked', etc.)
- Keeps explanations concise and natural
- Maintains genuine informativeness despite the humor

**Run from project root:**
```bash
python backend/LLMs/tostranslate.py
```

This will analyze the default `tos.txt` file in the LLMs folder.

**To analyze a custom ToS file:**
```python
from backend.LLMs.tostranslate import translate_tos

result = translate_tos("path/to/your/tos.txt")
print(result)
```

## Example Workflow

1. **Set up API key:**
   ```powershell
   $env:GEMINI_API_KEY="your_api_key_here"
   ```

2. **Install dependencies:**
   ```bash
   pip install google-generativeai python-dotenv
   ```

3. **Place your ToS document** in `backend/LLMs/tos.txt` or specify the path

4. **Run analysis:**
   ```bash
   # For detailed report
   python backend/LLMs/tosreport.py

   # For Gen-Z summary
   python backend/LLMs/tostranslate.py
   ```

## Using .env File (Alternative)

Instead of setting environment variables manually, you can create a `.env` file in the project root:

Create `.env`:
```
GEMINI_API_KEY=your_api_key_here
```

Then load it in your Python code:
```python
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.environ.get("GEMINI_API_KEY")
```

⚠️ **Never commit `.env` files to version control** - add `.env` to `.gitignore`

## Troubleshooting

**Error: "GEMINI_API_KEY environment variable is not set"**
- Verify you've set the environment variable correctly
- Check spelling: `GEMINI_API_KEY` (all caps)
- You may need to restart your terminal or IDE after setting the variable

**Error: "No module named 'google.generativeai'"**
- Install the package: `pip install google-generativeai`
- Ensure you're using the correct Python environment

**API Rate Limits**
- The free tier of Gemini API has rate limits
- Check [Google AI documentation](https://ai.google.dev/) for current limits

## Files

- `tosreport.py` - Detailed structured analysis with numerical scores
- `tostranslate.py` - Casual Gen-Z style red flag summary
- `tos.txt` - Default Terms of Service document to analyze (optional)

## API Model

Both scripts use `gemini-2.5-flash`, a fast and capable model suitable for text analysis tasks.

## License

Part of the SASEHacksCFF project.
