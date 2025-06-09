# ##################################
# Execution :
# streamlit run .\app.py
#
# Prerequis : 
# init ANTHROPIC_API_KEY & GEMINI_API_KEY env vars


# ##################################
# Imports
# #
import streamlit as st
import anthropic
import os
import google.generativeai as genai

# ##################################
# Constants
# #
MAX_ITERATIONS = 2

# ###############################
# Functions
# #

def call_claude_api(prompt: str, model: str = 'claude-3-opus-20240229') -> str:
    """
    Calls the Claude API with a given prompt and model.

    Args:
        prompt (str): The prompt to send to the Claude model.
        model (str): The Claude model to use (default: 'claude-3-opus-20240229').

    Returns:
        str: The text response from the Claude model.
    """
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise ValueError("ANTHROPIC_API_KEY environment variable not set.")

    client = anthropic.Anthropic(api_key=api_key)

    message = client.messages.create(
        model=model,
        max_tokens=1024,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    return message.content[0].text

def call_gemini_api(prompt: str, model: str = 'gemini-1.5-pro-latest') -> str:
    """
    Calls the Gemini API with a given prompt.

    Args:
        prompt (str): The prompt to send to the Gemini model.
        model (str): The Gemini model to use (default: 'gemini-pro').

    Returns:
        str: The text response from the Gemini model.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable not set.")

    genai.configure(api_key=api_key)
    gemini_model = genai.GenerativeModel(model)

    response = gemini_model.generate_content(prompt)
    return response.text

def orchestrate_llm_collaboration(user_prompt: str, max_turns: int = 3) -> str:
    """
    Orchestrates a collaboration between Claude and Gemini LLMs.

    Args:
        user_prompt (str): The initial prompt from the user.
        max_turns (int): The maximum number of turns for the collaboration.

    Returns:
        str: The final conversation transcript or the last agreed-upon response.
    """
    conversation_history = []
    agreed_keyword = "Meilleure réponse"

    # 1. Start the collaboration by calling call_claude_api with the user_prompt.
    claude_response = call_claude_api(user_prompt)
    conversation_history.append(f"Claude (initial): {claude_response}")

    # 2. Enter a loop that runs for a maximum of max_turns.
    for turn in range(max_turns):
        # a. Call call_gemini_api. The prompt for Gemini should include Claude's current response
        #    and instruct Gemini to analyze, criticize, and propose a new idea,
        #    explicitly asking Gemini to "say if you think that Claude proposal is the best".
        gemini_prompt = (
            f"Réalise une analyse critique de la réponse de : '{claude_response}'. "
            f"Propose une réponse adaptée."
            f"Enfin, indiques {agreed_keyword.lower()} si la réponse est la meilleure."
        )
        gemini_response = call_gemini_api(gemini_prompt)
        conversation_history.append(f"Gemini (turn {turn + 1}): {gemini_response}")

        # b. Check Gemini's response for the agreement keyword "Agreed". If found, break the loop.
        if agreed_keyword.lower() in gemini_response.lower():
            return "\n".join(conversation_history)

        # c. Call call_claude_api again. The prompt for Claude should include Gemini's critique
        #    and new proposal, and ask Claude to analyze it and compute an "agreed" from a prompt
        #    asking if Claude agrees with Gemini's answer.
        claude_prompt = (
            f"Réalise une analyse critique de la réponse de :  '{gemini_response}'. "
            f"Propose une réponse adaptée."
            f"Enfin,  si la réponse est la meilleure, indiques {agreed_keyword.lower()}."
        )
        claude_response = call_claude_api(claude_prompt)
        conversation_history.append(f"Claude (turn {turn + 1}): {claude_response}")

        # d. Check Claude's response for the agreement keyword "Agreed". If found, break the loop.
        if agreed_keyword.lower() in claude_response.lower():
            return "\n".join(conversation_history)

    # 3. Return the final conversation transcript or the last agreed-upon response.
    return "\n".join(conversation_history)

def collaborate_agents(claude_response, gemini_critique, gemini_proposition):
    # This function is no longer needed as its logic is integrated into orchestrate_llm_collaboration
    # Keeping it as a placeholder or for potential future use if the original streamlit app logic needs it.
    if "simple enough" in gemini_proposition:
        return gemini_proposition, True  # Claude agrees
    else:
        return f"Claude's adapted response to Gemini's critique ('{gemini_critique}') and proposition ('{gemini_proposition}')", False # Claude does not agree

# ##################################
# Main
# #
st.set_page_config(page_title="Collab-IA Chat", page_icon="💬")

st.title("Collab-IA: Collaborative AI Chat")
st.write("Interrogez un couple d'agents (Claude + Gemini) pour obtenir la meilleure réponse collégiale.")

# Initialize chat history
if "messages" not in st.session_state:
    st.session_state.messages = []

# Display chat messages from history on app rerun
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# React to user input
if prompt := st.chat_input("Posez votre question ici..."):
    # Display user message in chat message container
    st.chat_message("user").markdown(prompt)
    # Add user message to chat history
    st.session_state.messages.append({"role": "user", "content": prompt})

    with st.chat_message("assistant"):
        with st.spinner("Le conseil des IA a commencé ..."):
            collegiate_answer = ""
            claude_current_response = ""
            agreed = False
            
            # Initialization: Start the process with Claude.
            collegiate_answer = orchestrate_llm_collaboration(prompt, MAX_ITERATIONS)

            claude_prompt = (
            f"Relis la conversation et écris la réponse préférée '{collegiate_answer}'. "
            )
            final_response = call_claude_api(claude_prompt)

            st.markdown(final_response)

            # Bouton pour télécharger la conversation
            st.download_button(
                label="Télécharger le fichier texte",
                data=collegiate_answer,
                file_name='conversation.txt',
                mime='text/plain'
            )

st.sidebar.header("À propos")
st.sidebar.info(
    "Cette application utilise Streamlit pour créer une interface de chat. "
    "Le concept est de simuler une collaboration entre deux agents d'IA (Claude et Gemini) "
    "pour fournir une réponse collégiale à la question de l'utilisateur."
)