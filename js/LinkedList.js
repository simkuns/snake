class LinkedList {
  constructor () {
    this.head = null;
    this.length = 0;
  }

  insertAtHead (data) {
    const node = new LinkedListNode(data, this.head);
    this.head = node;
    this.length++;
  }

  static fromValues (...values) {
    const list = new LinkedList();
    let index = values.length;
    while (index) {
      list.insertAtHead(values[--index]);
    }
    return list;
  }

  getByIndex(index) {
    if (index < 0 || this.length <= index) return null;
    
    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current.next;
    }
    return current;
  }

  insertAtIndex(index, value) {
    if (index === 0) return this.insertAtHead(value);

    const prev = this.getByIndex(index - 1);
    if (prev == null) return null;

    prev.next = new LinkedListNode(value, prev.next);
    this.length++;
  }
}

class LinkedListNode {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

export default LinkedList;
