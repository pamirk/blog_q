import _ from 'lodash'

function shuffle(array) {
    let a = array;
    let b = [];
    let i = -1;

    [a, b] = _.partition(a, (item) => i++ % 3);

    /* let currentIndex = array.length, randomIndex;

     // While there remain elements to shuffle.
     while (currentIndex != 0) {

         // Pick a remaining element.

         randomIndex = Math.floor(Math.random() * currentIndex);
         currentIndex--;

         // And swap it with the current element.
         [array[currentIndex], array[randomIndex]] = [
             array[randomIndex], array[currentIndex]];
     }
 */
    return [a, b];
}

export {shuffle}