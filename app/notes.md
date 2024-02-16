# Timers -- There are two types of time in JS

1. set timeout timer -- runs just once after a defined time. The CBF executes only once.

2. set interval timer -- keeps running forever until we stop it. The CBF executes after the specified intervel repetedly.

# setTimeOut() --> Function (Used it in loan approval)

1. Syntax
   setTimeOut(() => callbackFunction)

Now, we are not calling the callback function directly. Rather setTimeOut function calls this CBF.
So, we won't be able to pass arguments into it..

setTimeout(() => console.log(`Here is your pizza 🍕`), 3000);

but we have a solution for this.

The first parameter of the function is the CBF, the second one is the time after which the CBF is executed(in ms) and then here is the solution. The parameters following the time are actually the parameters for CBF itself.

const pizzaTimer = setTimeout(
(ing1, ing2) => console.log(`Here is your pizza 🍕 with ${ing1} and ${ing2}`),
3000,
'olives',
'pineapple'
);

2. Can directly pass an array as the arguments for the CBF

const ingredients = ['olives', 'pineapples', 'tomato'];
const pizzaTimer = setTimeout(
ingredients => {
let str = ingredients.join(' and ');
console.log(`Here is your pizza with ${str}.`);
},
3000,
ingredients
);

3. Clear timeout
   So, upon a certain condition, the set timer will won't work and this will be decided by this function.

const ingredients = ['olives', 'pineapples', 'tomato'];
const pizzaTimer = setTimeout(
ingredients => {
let str = ingredients.join(' and ');
console.log(`Here is your pizza with ${str}.`);
},
3000,
ingredients
);

if (ingredients.includes('pineapples')) clearTimeout(pizzaTimer);

4. Also, since there is a certain delay before the setTimeout executes, it does not mean the that JS stops there and waits for it to execute first and then move to next block of code. Rather, the countdown happens in background and JS proceeds further. This is something called asynchronous JS. More later.

const ingredients = ['olives', 'pineapples', 'tomato'];
const pizzaTimer = setTimeout(
ingredients => {
let str = ingredients.join(' and ');
console.log(`Here is your pizza with ${str}.`);
},
3000,
ingredients
);

console.log(`Waiting...`) // This will be executed regardless the time set timeout takes for its execution.

if (ingredients.includes('pineapples')) clearTimeout(pizzaTimer);

# setInterval

1. Syntax -- Same as setTimeout..
