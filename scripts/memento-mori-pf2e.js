//Dev mode integration
const MODULE_ID = "memento-mori-pf2e";

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(MODULE_ID);
});

function log(...args) {
    try {
        const isDebugging = game.modules.get('_dev-mode')?.api?.getPackageDebugValue(MODULE_ID);

        if (isDebugging) {
            console.log(MODULE_ID, '|', ...args);
        }
    } catch (e) { }
}

//settings
function getSetting(key) {
    return game.settings.get(MODULE_ID, key)
}

Hooks.once('init', async function () {

    game.settings.register(MODULE_ID, "unlinkedStatusName", {
        name: "MEMENTO_MORI.Settings.UnlinkedStatusName.Name",
        hint: "MEMENTO_MORI.Settings.UnlinkedStatusName.Hint",
        scope: 'world',     // "world" = sync to db, "client" = local storage
        config: true,       // false if you dont want it to show in module config
        type: String,       // Number, Boolean, String,
        default: "Dead"
    })

    game.settings.register(MODULE_ID, "unlinkedStatusIcon", {
        name: "MEMENTO_MORI.Settings.UnlinkedStatusIcon.Name",
        hint: "MEMENTO_MORI.Settings.UnlinkedStatusIcon.Hint",
        scope: 'world',     // "world" = sync to db, "client" = local storage
        config: true,       // false if you dont want it to show in module config
        type: String,       // Number, Boolean, String,
        filePicker: "image",
        default: `modules/${MODULE_ID}/icons/pirate-grave.svg`
    })

    game.settings.register(MODULE_ID, "linkedStatusName", {
        name: "MEMENTO_MORI.Settings.LinkedStatusName.Name",
        hint: "MEMENTO_MORI.Settings.LinkedStatusName.Hint",
        scope: 'world',     // "world" = sync to db, "client" = local storage
        config: true,       // false if you dont want it to show in module config
        type: String,       // Number, Boolean, String,
        default: "Dying"
    })

    game.settings.register(MODULE_ID, "linkedStatusIcon", {
        name: "MEMENTO_MORI.Settings.LinkedStatusIcon.Name",
        hint: "MEMENTO_MORI.Settings.LinkedStatusIcon.Hint",
        scope: 'world',     // "world" = sync to db, "client" = local storage
        config: true,       // false if you dont want it to show in module config
        type: String,       // Number, Boolean, String,
        filePicker: "image",
        default: `modules/${MODULE_ID}/icons/bleeding-wound.svg`
    })

    game.settings.register(MODULE_ID, "overlay", {
        name: "MEMENTO_MORI.Settings.Overlay.Name",
        hint: "MEMENTO_MORI.Settings.Overlay.Hint",
        scope: 'world',     // "world" = sync to db, "client" = local storage
        config: true,       // false if you dont want it to show in module config
        type: Boolean,       // Number, Boolean, String,
        default: true
    })

    game.settings.register(MODULE_ID, "hitPath", {
        name: "MEMENTO_MORI.Settings.HitPath.Name",
        hint: "MEMENTO_MORI.Settings.HitPath.Hint",
        scope: 'world',     // "world" = sync to db, "client" = local storage
        config: true,       // false if you dont want it to show in module config
        type: String,       // Number, Boolean, String,
        default: "system.attributes.hp.value"
    })

    game.settings.register(MODULE_ID, "comparison", {
        name: "MEMENTO_MORI.Settings.comparison.Name",
        hint: "MEMENTO_MORI.Settings.comparison.Hint",
        scope: 'world',     // "world" = sync to db, "client" = local storage
        config: true,       // false if you dont want it to show in module config
        type: String,       // Number, Boolean, String,
        default: "lt",
        choices: {
            "lt": game.i18n.localize("MEMENTO_MORI.Settings.comparison.LT"), //Less than or equal to
            "gt": game.i18n.localize("MEMENTO_MORI.Settings.comparison.GT") //greater than or equal to
        }
    })

    game.settings.register(MODULE_ID, "compareTo", {
        name: "MEMENTO_MORI.Settings.CompareTo.Name",
        hint: "MEMENTO_MORI.Settings.CompareTo.Hint",
        scope: 'world',     // "world" = sync to db, "client" = local storage
        config: true,       // false if you dont want it to show in module config
        type: String,       // Number, Boolean, String,
        default: "0"
    })
});

async function addEffect(actor) {
    log("Adding Effect to " + actor.name)
    if (actor.items.find(e => e.flags?.core?.statusId === MODULE_ID)) return //no new effect if one is already present
    let linked = actor.isToken ? "unlinked" : "linked"
    let name = getSetting(`${linked}StatusName`);
    let img = getSetting(`${linked}StatusIcon`);
    let effect = {
        name,
        img,
        type: "effect",
        flags: {
            core: {
                statusId: MODULE_ID,
            }
        }
    }
    await actor.createEmbeddedDocuments("Item", [effect])
}

async function updateOverlay(actor) {
    let linked = actor.isToken ? "unlinked" : "linked"
    let name = getSetting(`${linked}StatusName`);
    let img = getSetting(`${linked}StatusIcon`);
    let npcTokens = []
    let playerToken = null
    if (linked === "unlinked") {
        npcTokens = canvas.scene.tokens.filter(t => t.actorId === actor.id)//&& t.actorData.items.find(i => i.name === name)
        for (var i = 0; i < npcTokens.length; i++) {
            if (npcTokens[i].actor.items.find(e => e.name === name) !== undefined)
                img = npcTokens[i].actor.items.find(e => e.name === name).img
            else img = ''
            await npcTokens[i].update({ overlayEffect: img })
        }
    } else {
        if (!actor.isDead) img = ''
        else img = actor.items.find(e => e.name === name).img
        playerToken = canvas.scene.tokens.find(t => t.actorId === actor.id)
        await playerToken.update({ overlayEffect: img })
    }
    // console.log(MODULE_ID, " | updated token:", token.id)
}

async function removeOverlay(effect){
    let token = null
    // console.log(MODULE_ID, " | updated effect:", effect)
    if (effect.actor.isToken) token = effect.actor.token
    else token = canvas.scene.tokens.find(t => t.actorId === effect.actor.id)
    await token.update({ overlayEffect: '' })
}

async function removeEffects(actor) {
    log("Removing Effect From" + actor.name)
    let effects = actor.items.filter(e => e.flags?.core?.statusId === MODULE_ID)
    if (effects.length === 0) return
    for (let effect of effects) {
        await effect.delete()
    }
}

async function updateActor(actor, update) {
    if (!game.user === game.users.find(u => u.isGM && u.active)) return //first GM only
    let hp = getProperty(update, getSetting("hitPath"))
    if (hp === undefined) {
        if (getProperty(actor, getSetting("hitPath")) === undefined) console.warn(`${MODULE_ID} | The setting ${game.i18n.localize("MEMENTO_MORI.Settings.HitPath.Name")} is not a valid property of actor or that property is undefined`)
        return
    }
    let compareTo = isNaN(parseInt(getSetting("compareTo"))) ? getProperty(actor, getSetting("compareTo")) : parseInt(getSetting("compareTo"))
    if (compareTo === undefined) {
        console.warn(`${MODULE_ID} | The setting ${game.i18n.localize("MEMENTO_MORI.Settings.compareTo.Name")} is not a number or a valid property of actor or that property is undefined`)
        return
    }
    let comparison = getSetting("comparison")
    let dead = false
    switch (comparison) {
        case "lt":
            dead = hp <= compareTo;
            break
        case "gt":
            dead = hp >= compareTo;
            break
    }
    if (dead) await addEffect(actor)
    if (!dead && hp) await removeEffects(actor) //only remove if not dead and if hp exists, to avoid false removal
    if (getSetting("overlay")) await updateOverlay(actor)
}
Hooks.on("ready", () => {
    if (game.user.isGM) Hooks.on("updateActor", updateActor)
    log("Ready Hook Fired")
})
Hooks.on("deleteItem", removeOverlay)

