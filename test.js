var s = `/*shfkshfk*/ console.log(); /*sjflsjflsjkf
sjflsjfl*/
//dfgdgdfggdfg //dfgdgdfgdfg
if (true) {
/*sjdfljslfkj*/
//dfgdfgdfgdfg
}
//dfgdfgdfgdfgdfgdfg
/* else */ 
`;
var stringWithoutComments = s.replace(
  /(\/\*[^*]*\*\/)|(\/\/[^* \n]*)/g,
  function (x) {
    count += 1;
    return "1";
  }
);
console.log(stringWithoutComments);
