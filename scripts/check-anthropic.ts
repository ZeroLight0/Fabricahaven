import "dotenv/config";
import { anthropic, CLAUDE_MODEL } from "../src/lib/anthropic";

async function main() {
  console.log("Testing model:", CLAUDE_MODEL);
  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 50,
      messages: [{ role: "user", content: "Reply with exactly: OK" }],
    });
    console.log("Success. Response:", JSON.stringify(response.content));
  } catch (err) {
    console.error("Anthropic call failed:", err);
    process.exit(1);
  }
}

main();
