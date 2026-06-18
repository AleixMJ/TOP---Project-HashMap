import HashMap from './main';

// Assuming your HashMap class is exported from hashmap.js
const HashMap = require('./hashmap'); 

describe('HashMap', () => {
    let hashMap;

    beforeEach(() => {
        // Starts with a fresh HashMap before each test
        hashMap = new HashMap(); 
    });

    // 1. hash(key)
    test('hash() should return a valid index within capacity bounds', () => {
        const index = hashMap.hash('apple');
        expect(index).toBeGreaterThanOrEqual(0);
        expect(index).toBeLessThan(hashMap.capacity);
    });

    // 2. set(key, value) & 3. get(key)
    test('set() should insert a key-value pair and get() should retrieve it', () => {
        hashMap.set('name', 'Alice');
        expect(hashMap.get('name')).toBe('Alice');
    });

    test('set() should update the value if the key already exists', () => {
        hashMap.set('age', '25');
        hashMap.set('age', '26'); // Update existing key
        expect(hashMap.get('age')).toBe('26');
        expect(hashMap.length()).toBe(1); // Size shouldn't grow on updates
    });

    test('get() should return null if key is not found', () => {
        expect(hashMap.get('nonexistent')).toBeNull();
    });

    // 4. has(key)
    test('has() should return true if key exists, false otherwise', () => {
        hashMap.set('pet', 'dog');
        expect(hashMap.has('pet')).toBe(true);
        expect(hashMap.has('cat')).toBe(false);
    });

    // 5. remove(key)
    test('remove() should delete a key-value pair and return true', () => {
        hashMap.set('color', 'blue');
        expect(hashMap.remove('color')).toBe(true);
        expect(hashMap.has('color')).toBe(false);
        expect(hashMap.get('color')).toBeNull();
    });

    test('remove() should return false if the key does not exist', () => {
        expect(hashMap.remove('ghost')).toBe(false);
    });

    // 6. length()
    test('length() should return the number of stored keys', () => {
        expect(hashMap.length()).toBe(0);
        hashMap.set('a', 1);
        hashMap.set('b', 2);
        expect(hashMap.length()).toBe(2);
    });

    // 7. clear()
    test('clear() should remove all elements from the hash map', () => {
        hashMap.set('a', 1);
        hashMap.set('b', 2);
        hashMap.clear();
        expect(hashMap.length()).toBe(0);
        expect(hashMap.get('a')).toBeNull();
    });

    // 8. keys()
    test('keys() should return an array containing all stored keys', () => {
        hashMap.set('firstName', 'John');
        hashMap.set('lastName', 'Doe');
        const storedKeys = hashMap.keys();
        expect(storedKeys).toContain('firstName');
        expect(storedKeys).toContain('lastName');
        expect(storedKeys.length).toBe(2);
    });

    // 9. values()
    test('values() should return an array containing all stored values', () => {
        hashMap.set('item1', 'sword');
        hashMap.set('item2', 'shield');
        const storedValues = hashMap.values();
        expect(storedValues).toContain('sword');
        expect(storedValues).toContain('shield');
        expect(storedValues.length).toBe(2);
    });

    // 10. entries()
    test('entries() should return an array of [key, value] pairs', () => {
        hashMap.set('x', 10);
        hashMap.set('y', 20);
        const entries = hashMap.entries();
        expect(entries).toContainEqual(['x', 10]);
        expect(entries).toContainEqual(['y', 20]);
        expect(entries.length).toBe(2);
    });

    // --- Extra Credit / Advanced Logic Tests ---

    // Collision Handling
    test('should handle bucket collisions successfully', () => {
        // Intentionally picking keys that map to the same bucket to force separate chaining
        // If your hash function works perfectly, we can mock or just insert multiple elements
        hashMap.set('keyA', 'Value A');
        hashMap.set('keyB', 'Value B');
        hashMap.set('keyC', 'Value C');
        
        expect(hashMap.get('keyA')).toBe('Value A');
        expect(hashMap.get('keyB')).toBe('Value B');
        expect(hashMap.get('keyC')).toBe('Value C');
    });

    // Dynamic Resizing (Load Factor Trigger)
    test('should dynamically double capacity when load factor is exceeded', () => {
        const initialCapacity = hashMap.capacity; // 16
        
        // Load factor is 0.75. 16 * 0.75 = 12 items max.
        // Inserting 13 unique items should trigger our resize functionality
        for (let i = 1; i <= 13; i++) {
            hashMap.set(`key_${i}`, `value_${i}`);
        }

        expect(hashMap.capacity).toBe(initialCapacity * 2); // Should be 32 now
        expect(hashMap.length()).toBe(13); // Size count must remain correct
        expect(hashMap.get('key_5')).toBe('value_5'); // Values must re-hash perfectly
    });
});