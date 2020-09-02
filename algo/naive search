function naiveSearch(str,ptt){
    console.log("fsadf")
    let position = []
    let count = 0;
    for(let i = 0 ; i < str.length;i++){
        for(let y = 0 ; y < ptt.length ;y++){
            if(str[i+y] !== ptt[y]) break;
        
            if(y === ptt.length -1){
                position.push({start: i , end : i+y})
                count++
              }

        }
    }

   return {count,position};
}


console.log(naiveSearch("ravi pratap singh rohit pratap",'pratap'))

