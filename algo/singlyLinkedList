class Node{
    constructor(val){
        this.val = val;
        this.next = null;
    }
}


class SinglyLinkedList {
    constructor(){
        this.head = null;
        this.tail = null;
        this.lenght = 0
    }

    push(val){
        let newNode = new Node(val);
        if(!this.head){
            this.head = newNode;
            this.tail = this.head
        }else{
            this.tail.next = newNode; // ***** IMPORTANT LINE *****
            this.tail = newNode
        }
        this.lenght ++;
        return this;
    }

    pop(){
        if(!this.head) return undefined
        let current = this.head;
        let nextTail = current
        while(current.next){
            nextTail = current;
            current = current.next    
        }
        this.tail = nextTail;
        this.tail.next = null;
        this.lenght--;
        if(this.lenght ==0){
            this.head = null;
            this.tail = null;
        }
        return current;
    }
    
    shift(){
        if(!this.head) return undefined;
        let oldHead = this.head;
        this.head =oldHead.next;
        this.lenght --;
        if(this.lenght ==0){
            this.head = null;
            this.tail = null;
        }
        return oldHead;
    }

    unshift(val){
        let newNode = new Node(val);
        if(!this.head){
            this.head = newNode;
            this.tail= newNode
        }else{
            newNode.next = this.head;
            this.head = newNode
        }
        this.lenght++;
        return this;
    }
    get(index){
        if(index < 0 || index >= this.lenght) return null;
        let counter = 0 ;
        let current = this.head;
        while(counter !== index){
            counter ++;
            current = current.next;
        }
        return current
    }
    set(index,val){
        let node = this.get(index)
        if(node){
            node.val = val;
            return true
        }
        return false
    }
}

let list = new SinglyLinkedList();
list.push("Ravi"); list.push("Pratap");list.push("Singh");
