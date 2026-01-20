export class MaxHeap {
  constructor() {
    this.heap = [];
  }

  insert(item) {
    this.heap.push(item);
    this.bubbleUp();
  }

  bubbleUp() {
    let index = this.heap.length - 1;

    while (index > 0) {
      let parentIndex = Math.floor((index - 1) / 2);

      if (this.heap[parentIndex].score >= this.heap[index].score) {
        break;
      }

      [this.heap[parentIndex], this.heap[index]] =
        [this.heap[index], this.heap[parentIndex]];

      index = parentIndex;
    }
  }

  extractMax() {
    if (this.heap.length === 1) return this.heap.pop();

    const max = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.sinkDown();
    return max;
  }

  sinkDown() {
    let index = 0;
    const length = this.heap.length;

    while (true) {
      let left = 2 * index + 1;
      let right = 2 * index + 2;
      let largest = index;

      if (
        left < length &&
        this.heap[left].score > this.heap[largest].score
      ) {
        largest = left;
      }

      if (
        right < length &&
        this.heap[right].score > this.heap[largest].score
      ) {
        largest = right;
      }

      if (largest === index) break;

      [this.heap[index], this.heap[largest]] =
        [this.heap[largest], this.heap[index]];

      index = largest;
    }
  }
}
