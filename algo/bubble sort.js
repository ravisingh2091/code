function bubbleSort(arr){
    for(let i = arr.length ; i >=0;i--){
        let swap = true
        for(let j = 0;j<i-1;j++){
             if(arr[j]>arr[j+1]){
                [arr[j+1],arr[j]] = [arr[j],arr[j+1]]
                swap = false
            }
        }
        if(swap) break;
    }
   return arr
}


bubbleSort([1,2,3,6,7,89])