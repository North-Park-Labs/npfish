# Welcome to the playtest of NPFISH

NPFISH is an experimental game where you can code your own Chess AI that will be pitted against other Chess AIs.

### Instructions

1. Create a new file in the `engines` folder
2. Copy the code in `RandomBot.ts`
3. Rename the class to your own bot name, and fill in the `name` variable
4. Add your bot to the array in `engines/types.ts`
5. Go ahead and code your own logic in your new file!

There is a default Minimax algorithm function in the `engines/utils.ts` file that you are welcome to copy, if you just want to play around with the board evaluation functions.

Some hints...

- The code itself is not written in the most optimal way
- Alpha-Beta Pruning
- Better board evaluation

**PLEASE ONLY MODIFY CODE IN YOUR NEW ENGINE FILE.** If you are interested in contributing, please open a PR or text Teddy/Alex.

### Running

```
yarn dev
```

And open up `localhost:3000`

### Things we are currently working on adding

- Move it to a web worker so can calculate deeper
- Add a time limit infrastructure, so that you are limited by time
