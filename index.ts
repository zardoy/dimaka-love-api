import "./dimaka-mods-api/index";

import dimaka from "dimaka-love";

dimaka.addEventListener("worldLoaded", world => {
    if (world.savedInfo.type === "local") console.log("local world loaded");
})
