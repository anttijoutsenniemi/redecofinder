
// let refImage64 = "juu";
// let refImage642 = "";
// let refImage643 = "juu2";

// let refImageArray = [];

// (refImage64) ? refImageArray[refImageArray.length] = refImage64 : null;
// (refImage642) ? refImageArray[refImageArray.length] = refImage642 : null;
// (refImage643) ? refImageArray[refImageArray.length] = refImage643 : null;

// console.log(refImageArray);

const categories = ['Chairs', 'Sofas, armchairs and stools', 'Tables', 'Conference sets', 'Storage furniture', '1. Chairs', '2. Sofas, armchairs and stools', '3. Tables', '4. Conference sets', '5. Storage furniture'];

let firstWords = [];
for(let i = 0; i < categories.length; i++){
    let newWords = categories[i].split(' ').filter(word => /^[A-Za-z,]+$/.test(word));
    let firstWord = newWords[0].replace(/[^A-Za-z]/g, '').toLowerCase();
    firstWords.push(firstWord);
}
console.log(firstWords);


