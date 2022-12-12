# Welcome to the playtest of NPFISH

NPFISH is an experimental game where you can code your own Chess AI that will be pitted against other Chess AIs.

### Instructions

1. Run `yarn` in root to install dependencies.
1. Create a new file in the `engines` folder. You could call it `[your_name]Bot.ts`. For example, `TeddyBot.ts`.
1. Copy the code in `TemplateBot.ts`
1. Do the TODOs. For example, change the clas name to your own bot name, and fill in the `name` variable
1. Add your bot to the array in `engines/types.ts`
1. Now, code your own logic in the file you created!

> Hint: look at `BasicMinimax` in the engines directory as an example. You are welcome to copy it if you just want to test it out

Some caveats...

- The code itself is not written in the most optimal way
- Consider Alpha-Beta Pruning
- Think about Better board evaluation

**PLEASE ONLY MODIFY CODE IN YOUR NEW ENGINE FILE.** If you are interested in contributing, please open a PR or text Teddy/Alex.

### Try it out!

```
yarn dev
```

And open up `localhost:3000`

### Things we are currently working on adding

- Move it to a web worker so can calculate deeper
- Add a time limit infrastructure, so that you are limited by time
