import {NeutralPlayerInstance, Player} from '../Player'
import {v4 as uuidv4} from 'uuid'

export enum TileType {
    None = 0,
    Ground = 1,
    GroundBorder = 3,
    Town= 17,
    Port= 19,
}

export type TilePublic = {
    id: string
    player ?: {
        name: string,
        color: string
    },
    isTerrain: boolean
    isTown: boolean
}

export class Tile {

    public readonly id: string
    public isTerrain = false
    public isTown = false
    public player ?: Player
    public isNeutral = true

    constructor(tileNumber: number | undefined) {
        this.id=uuidv4()
        switch(tileNumber){
            case TileType.None:
                this.isNeutral = true
                break
            case TileType.Ground:
            case TileType.GroundBorder:
                this.isTerrain = true
                break
            case TileType.Town:
            case TileType.Port:
                this.player = NeutralPlayerInstance
                this.isTown = true
                break
            default:
                console.log("Tile type not managed", tileNumber)
        }
    }

    export(): TilePublic {
        const exportData: TilePublic = {
            id: this.id,
            isTerrain: this.isTerrain,
            isTown: this.isTown
        }
        if(this.player) {
            exportData.player = {
                name: this.player.name,
                color: this.player.color
            }
        }
        return exportData
    }

}
