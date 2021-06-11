function nextBigger(n){
  let numberArray = [];
  let num = n.toString().split('');
  let numCopy = n.toString().split('');
  for(let i = 0; i < num.length; i++) {
    numCopy.push(numCopy.shift());
    let x = parseFloat(numCopy.join(''));
    console.log(n);
    console.log(x);
    if(x > n) {
      numberArray.push(x);
    }
  }
  return (numberArray.length > 0) ? Math.min(...numberArray) : n;
}

let a = nextBigger(513);
let b = nextBigger(79224919);

  console.log(a);
  console.log(b);