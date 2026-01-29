import { Trie } from "./trie";

export function buildProblemTrie(problems) {
  const trie = new Trie();

  for (let problem of problems) {
    trie.insert(problem.title, problem);
  }

  return trie;
}

// ✅ ADD THIS
export function searchTrie(trie, query) {
  if (!query) return [];
  return trie.search(query);
}

