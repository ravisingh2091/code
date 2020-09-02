let str = "([()]{[]}{})";
let strW = "([)]";

let arr = str.split('');
let temp = []

for(let i =0;i<arr.length;i++){
    if(arr[i] ==='(' || arr[i] ==='{'  ||arr[i] ==='['){
        temp.push(arr[i])
    }else{
            if(arr[i] == ")"){
                if(temp[temp.length -1] == "("){
                    temp.pop()
                }
            }else if(arr[i] == "}"){
                if(temp[temp.length -1] == "{"){
                    temp.pop()
                }
            }else if(arr[i] == "]"){
                if(temp[temp.length -1] == "["){
                    temp.pop()
                }
            }
    }
   
}


console.log(temp)
