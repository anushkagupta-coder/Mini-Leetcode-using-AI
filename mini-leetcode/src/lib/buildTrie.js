import { Trie } from "./trie";

export function buildProblemTrie(problems) {
  const trie = new Trie();

  problems.forEach((problem) => {
    trie.insert(problem.title, problem);
  });

  return trie;
}
