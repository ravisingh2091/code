function binarySearch(arr,elem){
    let start = 0
    let end = arr.length - 1;
    let middle = Math.round((start+end)/2);

    while(arr[middle] !== elem  && start <= end){
        if(elem > arr[middle] ){
            end = middle - 1    
        }else{
            start = middle + 1       
        }
        middle = Math.round((start+end)/2)
    }
    return arr[middle] === elem ? middle : -1

 
}
binarySearch([15,14,10,8,3,2,1],11)
//       15 , 14 , 10 , 8 , 3 , 2 , 1
//       f   m     l           

         