[![Supported Foundry Versions](https://img.shields.io/endpoint?url=https://foundryshields.com/version?url=../../releases/latest/download/module.json)](https://foundryvtt.com/packages/memento-mori-pf2e) [![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fmemento-mori-pf2e&colorB=0374b5)](https://forge-vtt.com/bazaar#sort=updated&package=memento-mori-pf2e)  
[![Latest Downloads](https://img.shields.io/github/downloads/paulo-roger/memento-mori-pf2e/latest/module.zip?color=blue&label=latest%20downloads)](../../releases/latest) [![Total Downloads](https://img.shields.io/github/downloads/paulo-roger/memento-mori-pf2e/module.zip?color=blue&label=total%20downloads)](../../releases)  
[![Discord](https://dcbadge.vercel.app/api/shield/219289132235489280?style=flat)](https://discordapp.com/users/219289132235489280) [![Ko-fi](https://img.shields.io/badge/Ko--fi-winterwulf-0374b5?logo=kofi)](https://ko-fi.com/winterwulf)

# Memento Mori

When installed, this module will automatically mark tokens with a configurable status effect when they run out of health.  
The status effect name and icon can be set by the user, and a different effect can be used for linked or unlinked tokens (e.g. dead vs dying).

## Functions

The module is set up out-of-the-box for Pathfinder 2e only which use this path for an actor's HP (`system.attributes.hp.value`).  There are settings to configure which will allow the attribute path being monitored to be changed, as well as the check (so e.g. if your system requires marking a token dead/dying when their `wounds` are greater than their `maxWounds`, that can be done).  More complex setups (e.g. "a token is dead if each of its 6 stats is marked") are not supported.

## Settings

## Dependencies
- [Token Magic FX](https://foundryvtt.com/packages/tokenmagic)

## Known Issues
So far none.

## Feedback
If you have suggestions or want to report a problem, you can create an issue here: [Issues](../../issues)

## Changelog
You can read the changelog here: [CHANGELOG.md](/CHANGELOG.md)

## Special Thanks
`BadIdeasBureau` developer of the original [Memento Mori](https://github.com/BadIdeasBureau/memento-mori) and `ApoApostolov` commissioner for this module.

## Attributions

Icons from game-icons.net
Bleeding Wound and Pirate grave icon by [Lorc](https://lorcblog.blogspot.com/) under [CC BY 3.0](http://creativecommons.org/licenses/by/3.0/), from http://game-icons.net