
class HashNode {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.nextNode = null;
    }
}

class HashMap {

    constructor() {
        this.capacity = 16;
        this.loadFactor = 0.75;
        this.size = 0;
        this.buckets = new Array(this.capacity).fill(null);
    }
    


    hash(key) {
    let hashCode = 0;

    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
        hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % this.capacity;
    }

    return hashCode;
    } 

       set(key, value) {

        if (!this.has(key) && this.size >= this.loadFactor * this.capacity) {
            this.increaseBuckets();
            }

        const bucketIndex = this.hash(key);

        // Odin Project Guard Clause
        if (bucketIndex < 0 || bucketIndex >= this.buckets.length) {
            throw new Error("Trying to access index out of bound");
        }

        const newNode = new HashNode(key, value)
        

        if (this.buckets[bucketIndex] === null) {

            this.buckets[bucketIndex] = newNode;
            this.size++;            
            return
        }

        let currentNode = this.buckets[bucketIndex]

        while (currentNode !== null) {

            if(currentNode.key === key) {
                currentNode.value = value;
                return
            }

            if (currentNode.nextNode === null) {
                currentNode.nextNode = newNode;
                this.size++;
                return
            }
            currentNode = currentNode.nextNode;
        }
    }

    increaseBuckets() {
        const allPairs = [...this.entries()];

        this.capacity = this.capacity * 2;
        this.buckets = new Array(this.capacity).fill(null);
        this.size = 0;               
        
        for (let pair of allPairs) {
            this.set(pair[0], pair[1]);        
            }
    }

    get(key) {

        const bucketIndex = this.hash(key);
        let currentNode = this.buckets[bucketIndex]

        while (currentNode !== null) {
            if (currentNode.key === key) {
                return currentNode.value;
            }
            currentNode = currentNode.nextNode;
        }
        return null;
    }

    has(key) {
        const bucketIndex = this.hash(key);
        let currentNode = this.buckets[bucketIndex]

        while (currentNode !== null) {
            if (currentNode.key === key) {                
                return true;
            }
            currentNode = currentNode.nextNode;
        }
        return false;
    }

    remove(key) {
        const bucketIndex = this.hash(key);
        let currentNode = this.buckets[bucketIndex]

        if (currentNode === null) {
            return false;
        }

        if (currentNode.key === key) {
            this.buckets[bucketIndex] = currentNode.nextNode;
            this.size--;
            return true;
        }

        let previousNode = currentNode;
        currentNode = currentNode.nextNode;

        while (currentNode !== null) {
            if (currentNode.key === key) {
                previousNode.nextNode = currentNode.nextNode;
                this.size--;
                return true;
            }
            previousNode = currentNode;
            currentNode = currentNode.nextNode;
        }
        return false;       
    }

    length() {
        return this.size;
    }

    clear() {
        this.capacity = 16;
        this.buckets = new Array(this.capacity).fill(null);
        this.size = 0;
    }

    values() {
        let result = [];
  
        for (let i = 0; i < this.buckets.length; i++) {
            let currentNode = this.buckets[i];
            while (currentNode !== null) {
                result.push(currentNode.value);
                currentNode = currentNode.nextNode;
            }
        }

        return result;
    }

    keys() {
        let result = [];
  
        for (let i = 0; i < this.buckets.length; i++) {
            let currentNode = this.buckets[i];
            while (currentNode !== null) {
                result.push(currentNode.key);
                currentNode = currentNode.nextNode;
            }
        }

        return result;
    }

    entries() {
        let result = [];
  
        for (let i = 0; i < this.buckets.length; i++) {
            let currentNode = this.buckets[i];
            while (currentNode !== null) {
                result.push([currentNode.key, currentNode.value]);
                currentNode = currentNode.nextNode;
            }
        }

        return result;
    }
}
export default HashMap;