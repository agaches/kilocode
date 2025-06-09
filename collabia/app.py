# ##################################
# Imports
# #
import streamlit as st

# ##################################
# Constants
# #
MAX_ITERATIONS = 2

# ###############################
# Functions
# #

def call_claude_api(input_prompt):
    # Placeholder for actual Claude API call
    return f"Claude's response to: '{input_prompt}'"

def call_gemini_api(claude_response_for_gemini):
    # Placeholder for actual Gemini API call
    # Gemini provides a critique and its own proposition
    critique = f"Gemini's critique of Claude's response: '{claude_response_for_gemini}'"
    proposition = f"Gemini's proposition based on Claude's response: '{claude_response_for_gemini}'"
    return critique, proposition

def collaborate_agents(claude_response, gemini_critique, gemini_proposition):
    # Placeholder for Claude's adaptation based on Gemini's feedback
    # For simplicity, Claude "agrees" if the proposition is simple enough
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
        with st.spinner("Les agents discutent..."):
            collegiate_answer = ""
            claude_current_response = ""
            agreed = False
            
            # Initialization: Start the process with Claude.
            claude_current_response = call_claude_api(prompt)
            
            # Loop for interaction between Claude and Gemini APIs
            for i in range(MAX_ITERATIONS):
                if agreed:
                    break

                # Transmit Claude's response to Gemini, which will provide a critique and its own proposition.
                gemini_critique, gemini_proposition = call_gemini_api(claude_current_response)
                
                # Send Gemini's response and proposition back to Claude for adaptation.
                claude_current_response, agreed = collaborate_agents(claude_current_response, gemini_critique, gemini_proposition)
                
                if agreed:
                    collegiate_answer = claude_current_response
                else:
                    collegiate_answer = f"Collaboration in progress (iteration {i+1}): {claude_current_response}"

            if not agreed:
                collegiate_answer = f"Final collegiate answer after {MAX_ITERATIONS} iterations: {claude_current_response}"

            st.markdown(collegiate_answer)
    # Add assistant response to chat history
    st.session_state.messages.append({"role": "assistant", "content": collegiate_answer})

st.sidebar.header("À propos")
st.sidebar.info(
    "Cette application utilise Streamlit pour créer une interface de chat. "
    "Le concept est de simuler une collaboration entre deux agents d'IA (Claude et Gemini) "
    "pour fournir une réponse collégiale à la question de l'utilisateur."
)