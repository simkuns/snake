import LinkedList from './LinkedList';

describe('#insertAtHead', () => {
  test('it adds the element to the beginning of the list', () => {
    const list = new LinkedList();

    list.insertAtHead(10);
    const oldHead = list.head;
    list.insertAtHead(20);

    expect(list.head.value).toBe(20);
    expect(list.head.next).toBe(oldHead);
    expect(list.length).toBe(2);
  });
});

describe('#getByIndex', () => {
  describe('with index less than 0', () => {
    test('it returns null', () => {
      const list = LinkedList.fromValues(10, 20);
      
      expect(list.getByIndex(-1)).toBeNull();
    });
  });

  describe('with index greater than list length', () => {
    test('it returns null', () => {
      const list = LinkedList.fromValues(10, 20);
      
      expect(list.getByIndex(-1)).toBeNull();
    });
  });

  describe('with index 0', () => {
    test('it returns head', () => {
      const list = LinkedList.fromValues(10, 20);

      expect(list.getByIndex(0)).toBe(list.head);
    });
  });

  describe('with index in the middle', () => {
    test('it returns the element at that index', () => {
      const list = LinkedList.fromValues(10, 20, 30, 40);

      expect(list.getByIndex(2).value).toBe(30);
    });
  });
});

describe('#insertAtIndex', () => {
  describe('with index less than 0', () => {
    test('it does not insert anything', () => {
      const list = LinkedList.fromValues(10, 20);
      list.insertAtIndex(-1, 30);
  
      expect(list.length).toBe(2);
    });
  });

  describe('with index greater than list length', () => {
    test('it does not insert anything', () => {
      const list = LinkedList.fromValues(10, 20);
      list.insertAtIndex(3, 30);
  
      expect(list.length).toBe(2);
    });
  });

  describe('with index 0', () => {
    test('insert at head', () => {
      const list = LinkedList.fromValues(10, 20);
      list.insertAtIndex(0, 30);
  
      expect(list.head.value).toBe(30);
      expect(list.head.next.value).toBe(10);
      expect(list.length).toBe(3);
    });
  });

  describe('with index in the middle', () => {
    test('insert element at that index', () => {
      const list = LinkedList.fromValues(10, 20, 30, 40);
      list.insertAtIndex(2, 50);
      const node = list.getByIndex(2);
  
      expect(node.value).toBe(50);
      expect(node.next.value).toBe(30);
      expect(list.length).toBe(5);
    });
  });
});
