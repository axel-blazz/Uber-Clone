# agents/base.py
from autogen_agentchat.agents import AssistantAgent

def create_agent(name: str, system_message: str, model_client):
    return AssistantAgent(
        name=name,
        system_message=system_message,
        model_client=model_client,
    )
