# app.py
import asyncio
from config import make_model_client
from agents.user_agent import get_user_agent
from agents.captain_agent import get_captain_agent
from agents.first_aid_agent import get_first_aid_agent
from agents.routing_agent import get_routing_agent

async def run_agent(agent, task: str) -> str:
    result = await agent.run(task=task)
    return result.messages[-1].content if result.messages else ""

async def main():
    model_client = make_model_client()

    # Create agents
    agents = {
        "user_agent": get_user_agent(model_client),
        "captain_agent": get_captain_agent(model_client),
        "first_aid_agent": get_first_aid_agent(model_client),
    }
    router = get_routing_agent(model_client)

    print("Uber Clone Chatbot 🚕 (type 'exit' to quit)")

    while True:
        user_text = input("You: ").strip()
        if user_text.lower() in {"exit", "quit"}:
            break

        # Routing step
        routing_decision = await run_agent(router, f"User said: {user_text}")
        routing_choice = routing_decision.strip().lower()

        if routing_choice not in agents:
            print(f"(Router fallback → user_agent)")
            routing_choice = "user_agent"

        # Delegate task
        agent = agents[routing_choice]
        reply = await run_agent(agent, user_text)
        print(f"{agent.name}: {reply}")

    await model_client.close()

if __name__ == "__main__":
    asyncio.run(main())
