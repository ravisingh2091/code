function ArrayMinJumps(arr) {
  let n  = arr.length;
  let jumps = [n]

  if(n==0 || arr[0]==0){
    return -1
  }
 jumps[0] = 0;
for(let i = 1 ; i < n;i++){
  jumps[i] = 10000;
  for(let j = 0 ; j < i ; j++){
    if(i <= j + arr[j] && jumps[j] != 10000){
      jumps[i] = Math.min(jumps[i],jumps[j]+1)
      break;
    }
  }
}
return jumps[n-1] != 10000  ? jumps[n-1] : -1 ;
}
   
// keep this function call here 
// ArrayMinJumps([4,0,2,1,0,9]);
ArrayMinJumps([1, 3, 6, 3, 2,3, 6, 8, 9, 5 ])