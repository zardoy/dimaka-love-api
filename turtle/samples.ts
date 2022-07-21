const moveWhileCan = () => {
    turtle.move('forward')
}

const makeMiniMineDown = async () => {
    if (!turtle.getActiveTool().isInGroup('tool-pickaxe')) throw new Error('Give me pickaxe first!')
    if (turtle.inventory.getItem(1)?.id !== 'core:ladder') throw new turtle.StartError('Put ladder block in slot 1')
    if (!turtle.inventory.getItem(2)?.isBlock) throw new turtle.StartError('Put emergency block in slot 2')
    let i = 0
    while (true) {
        await turtle.useTool('forth')
        turtle.inventory.focus(1)
        turtle.inventory.putInWorld()
        const block = turtle.detector.detectBlock('down')
        if (turtle.fuel.actionsCount || (block && (block.isLiquid || !block.canMine))) {
            if (block.isLiquid) {
                turtle.inventory.focus(2)
                turtle.inventory.putInWorld()
            }
            for (; i > 0; i--) {
                await turtle.move('up')
            }
            break
        }
        await turtle.useTool('down')
        await turtle.move('down')
        i++
    }
}
