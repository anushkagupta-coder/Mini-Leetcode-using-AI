A full-stack AI powered coding practice platform , built using **Next.js** and **Supabase**, featuring efficient **DSA-based search**, and **AI-like code evaluation**.

## ✨ Features

- 🔍 Fast problem search using **Trie (Prefix Tree)**
- 🏆 Leaderboard ranking using **Max Heap (Priority Queue)**
- will add🧠 AI-style code evaluation using **rule-based static analysis**
- 📊 Problems stored in **PostgreSQL (Supabase)**
- ⚡ Modern full-stack architecture with **Next.js App Router**
- 
## 🛠 Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS  
- **Backend:** Next.js API Routes  
- **Database:** Supabase (PostgreSQL)  
- **DSA Used:** Trie, Heap  
- **AI Layer:** Rule-based evaluator (pluggable for LLMs)

## 🧠 Data Structures Used

### Trie
Used for prefix-based search of problem titles, allowing efficient search in **O(L)** time.

### Heap
Used to implement leaderboard ranking efficiently, avoiding full sorting on every update.

---

## ▶️ How to Run Locally

1. Clone the repository
```bash
git clone <repo-url>
cd mini-leetcode
npm install
npm run dev

