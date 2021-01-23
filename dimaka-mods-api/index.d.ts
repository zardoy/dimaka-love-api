// prisma oriented
// import type { Duration } from "dayjs/plugin/duration";

declare module "dimaka-love" {
    // type Events<E extends string, K extends {[event: E]: object}> = {
    //     addEventListener: (event: E, listener: (data: K[E]))
    // }
    
    type BasicPosition = Record<"x" | "y" | "z", number>;
    
    type Position = BasicPosition & {
        isFalling: boolean;
        set: (x: number, y: number, z: number) => void;
    };

    type CraftRecipe = {
        
    };

    type PlacedBy = {
        type: "program";
        mod: "core" | string;
    } | {
        type: "player";
        player: Player;
    };

    interface Block {
        from: "core" | string;
        name: string;
        getRecipes: CraftRecipe[];
        useRecipes: CraftRecipe[];
        state: {}
    }

    type BlockInWorld = Block & {
        position: Position;
        destroy: () => void;
        placedBy: PlacedBy
    }

    type DestroyedBlockInWorld = Block & {
        position: BasicPosition;
    }
    
    interface Player {
        name: string;
        position: Position;
        stats: {
            lastJoin: Date;
            firstJoin: Date;
            totalTime: Duration;
            joinsCount: number;
        }
        // 
    }
    type OnlineAndSeen = {
        isOnline: false;
        /**
         * `Date` of last leave;
         */
        lastSeen: Date;
    } & {
        isOnline: true;
        lastSeen: null;
    }
    type RegisteredPlayer = Player & OnlineAndSeen & {
        // action: (action: "unregister" | "kick" | "ban") => void;
    }

    type PlayerEvents = "connect" | "disconnect" | ""
    
    type PlaceBlockBasicProps = Pick<Block, "from" | "name"> & Partial<Pick<Block, "state">> & {
        /**
         * @default false
         */
        playSound?: boolean;
        /**
         * @default false
         */
        replace?: boolean;
    };
    type PlaceBlockProps = PlaceBlockBasicProps & {
        position: BasicPosition;
    };
    type FillBlocksProps = PlaceBlockBasicProps & Record<`position${Capitalize<"start" | "end">}`, BasicPosition>;
    
    interface World {
        playersOnline: Player[];
        registeredPlayers: RegisteredPlayer[];
        blocks: {
            // find...
            /**
             * @returns Whether the block was placed or not (if replace: true - always true)
             */
            place: (block: PlaceBlockProps) => Promise<boolean>;
            /**
             * @returns Whether all blocks have been placed or not
             */
            fill: (blocks: FillBlocksProps) => Promise<boolean>;
        };
        savedInfo: SavedWorld;

        suspend: (reason: string) => void;
        addPlayerEventListener(event: "connect" | "disconnect", player: Player): void;
        addPlayerEventListener(event: "kick" | "ban" | "unregister", player: Player): void;
        addPlayerEventListener(event: "blockPlaced", player: Player, newBlock: BlockInWorld): void;
        addPlayerEventListener(event: "blockDestroyed", player: Player, destroyedBlock: DestroyedBlockInWorld): void;
        addPlayerEventListener(event: "beforeBlockPlaced", player: Player, notExistingBlock: DestroyedBlockInWorld): void;
    }

    export const addEventListener: (event: "worldLoaded", listener: (world: World) => unknown) => void;
    
    // process?
    export const runner: {
        version: string;
        type: "client" | "server";
        modsCount: number;
        playerName: string;
    }
    
    interface SavedWorld {
        name: string;
        type: "local" | "synced";

        requestLoad: () => Promise<void>;
        /**
         * Throw error if user rejects
         */
        requestRemove: (reason: string) => Promise<void>;

        stats: {
            created: Date;
            lastJoined: Date;
            /**
             * can be 0
             */
            joinsCount: number;
            totalPlayed: Duration;
        }

        requestWorld: () => Promise<World>;
    }
    
    export const worlds: SavedWorld[];
}