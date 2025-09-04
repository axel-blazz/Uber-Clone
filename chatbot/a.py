import os, asyncio
from autogen_agentchat.agents import AssistantAgent, UserProxyAgent
from autogen_ext.models.openai import OpenAIChatCompletionClient

async def main():
    model_client = OpenAIChatCompletionClient(
        model="gemini-2.0-flash",
        api_key="AIzaSyDFgKzF0Smhom0vDVsQUv6ezLFVKmfAMgA",
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
    )

    assistant = AssistantAgent(
        name="gem_bot",
        system_message="You are a helpful assistant that answers concisely.",
        model_client=model_client,
    )

    # Take input from user at runtime
    user_input = input("You: ")

    result = await assistant.run(
        task=user_input
    )

    for msg in result.messages:
        print(f"{msg.source}: {msg.content}")

    await model_client.close()

if __name__ == "__main__":
    asyncio.run(main())
