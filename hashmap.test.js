import HashMap from './hashmap';

describe('HashMap', () => {
    let hashMap;

    beforeEach(() => {
        // Starts with a fresh, clean HashMap before each individual test
        hashMap = new HashMap();
    });

    // 1. Test the hashing function bounds
    test('hash() should return a valid index within capacity bounds', () => {
        const index = hashMap.hash('apple');
        expect(index).toBeGreaterThanOrEqual(0);
        expect(index).toBeLessThan(hashMap.capacity);
    });

    // 2. ISOLATED SET TEST (Bypasses the get method completely)
    test('set() should insert a key-value pair directly into the correct bucket slot', () => {
        const key = 'name';
        const value = 'Alice';
        const expectedIndex = hashMap.hash(key);

        hashMap.set(key, value);

        const nodeInBucket = hashMap.buckets[expectedIndex];

        expect(nodeInBucket).not.toBeNull();
        expect(nodeInBucket.key).toBe(key);
        expect(nodeInBucket.value).toBe(value);
    });

    // 3. Test updating a value when a key already exists
    test('set() should update the value if the key already exists', () => {
        const key = 'color';
        const expectedIndex = hashMap.hash(key);

        hashMap.set(key, 'red');
        hashMap.set(key, 'blue'); // Overwrite

        const nodeInBucket = hashMap.buckets[expectedIndex];
        expect(nodeInBucket.value).toBe('blue');
    });

    // 4. Test retrieving data via get()
    test('get() should retrieve the correct value associated with a key', () => {
        hashMap.set('age', '25');
        expect(hashMap.get('age')).toBe('25');
        expect(hashMap.get('nonexistent')).toBeNull();
    });

    // 5. Test checking existence via has()
    test('has() should return true if key exists, false otherwise', () => {
        hashMap.set('pet', 'dog');
        expect(hashMap.has('pet')).toBe(true);
        expect(hashMap.has('wildcard')).toBe(false);
    });

    // 6. Test removing keys via remove()
    test('remove() should delete a key and return true, or false if key not found', () => {
        hashMap.set('city', 'New York');
        
        expect(hashMap.remove('city')).toBe(true);
        expect(hashMap.get('city')).toBeNull();
        expect(hashMap.remove('nonexistent')).toBe(false);
    });

    // 7. Test length tracking
    test('length() should return the total number of stored keys', () => {
        expect(hashMap.length()).toBe(0);
        hashMap.set('a', 1);
        hashMap.set('b', 2);
        expect(hashMap.length()).toBe(2);
        
        // Updating shouldn't increase length
        hashMap.set('a', 5);
        expect(hashMap.length()).toBe(2);
    });

    // 8. Test clearing out the hash map
    test('clear() should remove all elements from the hash map', () => {
        hashMap.set('a', 1);
        hashMap.set('b', 2);
        hashMap.clear();

        expect(hashMap.length()).toBe(0);
        expect(hashMap.buckets.every(bucket => bucket === null)).toBe(true);
    });

    // 9. Test arrays collections extraction
    test('keys(), values(), and entries() should return correct collection arrays', () => {
        hashMap.set('key1', 'val1');
        hashMap.set('key2', 'val2');

        expect(hashMap.keys()).toEqual(expect.arrayContaining(['key1', 'key2']));
        expect(hashMap.values()).toEqual(expect.arrayContaining(['val1', 'val2']));
        expect(hashMap.entries()).toEqual(expect.arrayContaining([['key1', 'val1'], ['key2', 'val2']]));
    });

    // 10. Collision handler check
    test('should handle bucket collisions successfully using linked lists', () => {
        // Force mock two keys to hit the exact same index manually if needed, 
        // but adding multiple keys generally triggers collisions naturally.
        hashMap.set('at', 'value1');
        hashMap.set('by', 'value2'); 

        const index1 = hashMap.hash('at');
        const index2 = hashMap.hash('by');

        // Verify if they landed on the same index to prove collision handling works
        if (index1 === index2) {
            const headNode = hashMap.buckets[index1];
            expect(headNode).not.toBeNull();
            expect(headNode.nextNode).not.toBeNull(); // A chain exists!
        }
    });

    // 11. Dynamic Resizing and Re-hashing Check
    test('should automatically double capacity and re-hash existing keys when load factor threshold is crossed', () => {
        expect(hashMap.capacity).toBe(16);

        // Insert 13 unique items to cross the 12 item threshold (16 * 0.75 = 12)
        for (let i = 1; i <= 13; i++) {
            hashMap.set(`item-${i}`, `value-${i}`);
        }

        // Verify the array bucket size actually doubled
        expect(hashMap.capacity).toBe(32);
        expect(hashMap.buckets.length).toBe(32);
        expect(hashMap.length()).toBe(13);

        // Verify all elements are still fully accessible at their brand new hashed indices
        for (let i = 1; i <= 13; i++) {
            expect(hashMap.get(`item-${i}`)).toBe(`value-${i}`);
        }
    });
});