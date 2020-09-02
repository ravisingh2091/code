function selectionSort(arr){
    for(let i = 0; i <arr.length;i++){
        let min = i;
        for(let j = i+1 ; j < arr.length;j++){
           if(arr[min] > arr[j]){
                [arr[min],arr[j]] = [arr[j],arr[min]]
           }
        }
    }
     return arr;
}

selectionSort([1,2,3,4,-1])