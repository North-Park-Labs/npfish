# Welcome to the playtest of NPFISH

NPFISH is an experimental game where you can code your own Chess AI that will be pitted against other Chess AIs.

Discord: https://discord.gg/5DTHUkPc

### Instructions

1. Clone this repo to your local machine
1. Run `yarn` in root to install dependencies.
1. Create a new file in the `engines` folder. You could call it `[your_name]Bot.ts`. For example, `TeddyBot.ts`.
1. Copy the code in `TemplateBot.ts`
1. Do the TODOs. For example, change the class name to your own bot name, and fill in the `name` variable
1. Add your bot to the array in `engines/types.ts`
1. Now, code your own logic in the file you created!

> Hint: look at `BasicMinimax` in the engines directory as an example on how to return a `move` and an `evaluation`. You are welcome to copy it if you just want to test it out

Some hints on how you can improve the `TemplateBot`

- The code itself is not written in the most optimal way
- Consider Alpha-Beta Pruning
- Think about Better board evaluation

Your challenge is to try to write an engine that beats `BasicMinimax`!

The platform itself is pretty buggy, refreshing the pages usually does the trick.

**PLEASE ONLY MODIFY CODE IN YOUR NEW ENGINE FILE.** If you are interested in contributing, please open a PR or text Teddy/Alex.

### Try it out!

```
yarn dev
```

And open up `localhost:3000`

### Things we are currently working on adding

- Move it to a web worker so can calculate deeper
- Add a time limit infrastructure, so that you are limited by time
