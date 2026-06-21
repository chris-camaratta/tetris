# Tetris Clone
A while ago, 2008-ish by the timestamps on the original files, I was reading about prototypical inheritence and figured I'd try it out. I'd also been wanting to try my hand at creating a video game for awhile. I like Tetris so it seemed like as good a starting point as any. I took a weekend and got the major functionality in there, and then spent another three weeks off-and-on "polishing" it before I got sidetracked by real life. It looks like I did another update in ~2011; neither attempt utilized a build process, so everything was just jammed into "engine.js", including what passes for unit tests.
In June of 2026 I used CoPilot in VS Code to modernize the app into ES modules with the intent of having clearer separation between core utilities, game logic, and UI rendering, and to flesh out the test suite.

More detailed information can be found in [the docs](docs\design.md)

You can play the game [here](https://ccamarat.github.io/tetris), if you want.
