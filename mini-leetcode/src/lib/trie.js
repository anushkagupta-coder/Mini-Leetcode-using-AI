class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
    this.problems = [];
  }
}

export class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word, problem) {
    let node = this.root;

    for (let char of word.toLowerCase()) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
      node.problems.push(problem);
    }

    node.isEnd = true;
  }

  search(prefix) {
    let node = this.root;

    for (let char of prefix.toLowerCase()) {
      if (!node.children[char]) {
        return [];
      }
      node = node.children[char];
    }

    return node.problems;
  }
}
