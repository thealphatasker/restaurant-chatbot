import { useState } from "react";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
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
    <div className="app-root">
      <div className="page-wrapper">
        {/* Header */}
        <div className="header-container">
          <div className="flex items-center justify-between gap-3 px-6">
            <div className="flex items-center gap-3">
              <span className="text-5xl animate-bounce">🤖</span>
              <div className="text-center md:text-left">
                <h1 className="text-white">BiteBuddy AI</h1>
                <p className="text-purple-100">
                  Urban Bites Restaurant Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="send-button rounded-full px-4 py-2 text-sm">
                    Sign up
                  </button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <button className="send-button rounded-full px-4 py-2 text-sm">
                    Sign in
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: {
                        width: "40px",
                        height: "40px",
                      },
                    },
                  }}
                />
              </SignedIn>
            </div>
          </div>
        </div>

        <SignedIn>
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

          {/* Input */}
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
        </SignedIn>

        <SignedOut>
          <div className="chat-area flex items-center justify-center">
            <div className="message-bubble ai-message text-center max-w-xl mx-auto">
              <p className="whitespace-pre-wrap">
                Please{" "}
                <span className="font-semibold">sign in or sign up</span> to use
                BiteBuddy AI and chat about Urban Bites menu and information.
              </p>
            </div>
          </div>
        </SignedOut>
      </div>
    </div>
  );
}

export default App;
