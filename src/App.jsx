import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [query, setQuery] = useState("");
  const [chatList, setChatList] = useState([]);

  const handleQuerySubmit = async (e) => {
    e.preventDefault();

    try {
      setChatList((prev) => [...prev, { source: "user", text: query }]);

      const systemPrompt = `You are BiteBuddy AI, the official virtual assistant of Urban Bites restaurant.

Restaurant Information:
- Name: Urban Bites
- Hours: 11:00 AM to 11:00 PM

Menu (PKR):
- 🍕 Chicken Tikka Pizza (Medium) — PKR 1,399
- 🍔 Zinger Burger — PKR 549
- 🍟 Chicken Loaded Fries — PKR 549
- 🥪 Club Sandwich — PKR 599
- 🌯 Chicken Paratha Roll — PKR 299
- 🫔 Chicken Wrap — PKR 449
- 🥤 Regular Soft Drink — PKR 120

IMPORTANT: Only respond to queries related to Urban Bites restaurant, its menu, prices, and timings. Politely decline any unrelated questions by saying "I can only help with Urban Bites restaurant menu and information."`;

      const apiRes = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`,
        {
          contents: [
            {
              parts: [
                {
                  text: systemPrompt,
                },
                {
                  text: query,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "x-goog-api-key": import.meta.env.VITE_GEMINI_API_KEY,
            "Content-Type": "application/json",
          },
        },
      );

      const aiRes = apiRes.data.candidates[0].content.parts[0].text;
      setChatList((prev) => [...prev, { source: "ai", text: aiRes }]);
      setQuery("");
    } catch (err) {
      console.error(err);
      setChatList((prev) => [
        ...prev,
        {
          source: "ai",
          text: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    }
  };

  const clearQuery = () => {
    setQuery("");
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="header-container">
        <div className="flex items-center justify-center gap-3">
          <span className="text-5xl animate-bounce">🤖</span>
          <div className="text-center">
            <h1 className="text-white">BiteBuddy AI</h1>
            <p className="text-purple-100">Urban Bites Restaurant Assistant</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        <div className="space-y-3">
          {chatList.map((ms, index) => (
            <div
              key={index}
              className={`flex ${
                ms.source === "user" ? "justify-end" : "justify-start"
              } px-6 py-1`}
            >
              <div
                className={`message-bubble ${
                  ms.source === "user" ? "user-message" : "ai-message"
                }`}
              >
                <p className="whitespace-pre-wrap">{ms.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

   
      <div className="input-container">
        <form onSubmit={handleQuerySubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              id="query"
              type="text"
              className="input-field flex-1 rounded-full"
              placeholder="Ask about our menu..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="send-button rounded-full"
              disabled={!query.trim()}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
