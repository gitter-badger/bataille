import { UnitsType } from '../../common/UNITS'
import { TilePublic } from './map/Tile'

export interface GameState {
    status: 'running' | 'stopped'
    nextIncome: number
    players: PublicPlayerState[]
    currentPlayer: PrivatePlayerState
    units: UnitState[]
    towns: TownsState[]
}

export interface PrivatePlayerState extends PublicPlayerState {
    money: number
}
export interface PublicPlayerState {
    name: string
    income: number
    color: string
    countries: string[]
    connected: boolean
    dead: boolean
    surrender: boolean
}

export interface UnitState {
    id: string
    type: UnitsType
    hp: {
        current: number
        initial: number
    }
    position: {
        x: number
        y: number
    }
    color: string
}

export interface TownsState extends TilePublic {}
