import { MaxHeap } from "./maxHeap";

export function buildLeaderboard(users, k = 3) {
  const heap = new MaxHeap();

  users.forEach((user) => {
    heap.insert(user);
  });

  const topUsers = [];

  for (let i = 0; i < k && heap.heap.length > 0; i++) {
    topUsers.push(heap.extractMax());
  }

  return topUsers;
}
