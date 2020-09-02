function binarySearch(arr,data,start,middle,end){
 
  
  if(data !== arr[middle] && start <=end){
    if(data > arr[middle]){
      end = middle -1;
    }else{
      start = middle+1
    }
   middle =  Math.round((start + end)/2)
    binarySearch(arr,data,start,end)
  }
return arr[middle] ===data
 ? middle : -1 
  
}

let a = [100,50,37,10,6,4,2];
let start = 0 
let end = a.length -1;
let middle =  Math.round((start + end)/2)
binarySearch(a,14,start,middle,end)