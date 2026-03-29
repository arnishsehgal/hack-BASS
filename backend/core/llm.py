from google import genai
import os

def generate_explanations(materials_data):
    """
    Stage 5: Explainability
    Generate plain-language justifications for the chosen materials.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    
    # In a real environment, you'd batch this or do it asynchronously per element if needed.
    # To save tokens, we might map the recommendations and do a single large prompt.
    prompt = f"Given the following structural material recommendations, explain why each material was chosen in simple terms, referencing cost and strength tradeoffs. Data: {materials_data}"
    
    # Note: Replace with actual Gemini call when API key is available
    if api_key:
        try:
            client = genai.Client(api_key=api_key)
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
            )
            return response.text
        except Exception as e:
            return f"Error connecting to AI: {str(e)}"
        
    return {
        "status": "mock",
        "explanation": "No Gemini API Key found. Skipping live LLM call.\n\n[MOCK EXPLANATION]: The tradeoff heavily factors the mathematical outer hull (load-bearing walls) requiring durable RCC and Red Brick, while reducing load parameters for non-structural partitions allows using cheaper hollow concrete blocks to save overall budget."
    }
