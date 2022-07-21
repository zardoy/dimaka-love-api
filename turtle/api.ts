import { CraftRecipe } from 'dimaka-love'
import '../dimaka-mods-api/index'

type RegisteredTools = 'axe' | 'pickaxe' | 'shovel' | 'sword'

type RegisteredGroups = 'ore' | 'liquid' | 'wood' | `tool-${RegisteredTools}`
type RegisteredDimentions = 'overworld' | 'nether'

declare const dimaka: typeof import('dimaka-love')

interface GeneratableStats {
    worlds: Record<
        RegisteredDimentions,
        {
            levels: (number | [level: number, efficienty: number])[]
            // auto-generated
            mostEfficientLevel: number
        }
    >
}

interface Item {
    // marker-essential
    id: string
    mod: string | 'core'
    isBlock: boolean
    // /marker-essential
    stackable: boolean | number
    title: string
    // extra: ItemExtra
    isLiquid: boolean
    isInGroup(group: RegisteredGroups): boolean
    getCrafts(): CraftRecipe[]
    getUsages(): CraftRecipe[]
}

interface ItemOnly extends Item {
    /** @essential false */
    isBlock: false
}

// interface ItemExtra {
//     getNaturalGeneratableStats(): GeneratableStats
//     isCraftable: boolean
// }

interface ItemStackable extends Item {
    size: number
}

interface Coordinate {
    x: number
    y: number
    z: number
}

type Addon = 'locatorNet'
type Distinct<T> = /*special*/ T
type MoveDirection = 'up' | 'down' | 'forward' | 'backward' | 'left' | 'right'
type RotateDirection = 'left' | 'right'
type LookDirection = 'forth' | 'up' | 'down'

interface Block extends Item {
    isBlock: true
    canMine: boolean
}

interface TurtleApi {
    /** Can be ignored */
    StartError: typeof Error
    hardware: {
        installedAddons: Distinct<Addon[]>
    }
    inventory: {
        focused: number
        focus(slotNumber: number): void
        putInWorld(): void
        getItem(slotNumber?: number): ItemStackable | null
        drop(count?: /*1*/ number): void
        focusSlotUntil(tempSlotNumber: number, callback: () => Promise<void>): Promise<void>
        slotsCount: number
    }
    detector: {
        detectBlock(lookDirection: LookDirection): Block | null
        isEmpty(lookDirection: LookDirection): boolean
        detectArea(pattern: number): (Block | null)[][][]
        searchableArea: [number, number, number]
        requestSearchForDroppedItems(pattern: number): ItemStackable[][][]
    }
    /** @throws (can't mine;) */
    useTool(direction: LookDirection, mineUntilEmpty?: /*true*/ boolean): Promise<Item>
    getActiveTool(): ItemOnly
    move(direction: MoveDirection): Promise<void>
    rotate(direction: RotateDirection): Promise<void>
    fuel: {
        level: number
        actionsCount: number
        fuel(consumeCount: number | 'all'): Promise<boolean>
    }
    net: {
        locateCoordinates(): Promise<Coordinate>
        locateRelativeCoordinates(): Promise<Coordinate>
        communicate(message: string, machineName?: string): Promise<boolean>
        ensureNumberOfMachines(number: number): Promise<boolean>
        reboot(machineName: string): Promise<void>
    }
    miniNet: {
        listenToCommand(channel: string, listener: (data: any) => any): void
        sendNotification(data: string): Promise<boolean>
    }
}

declare global {
    const turtle: TurtleApi
}
