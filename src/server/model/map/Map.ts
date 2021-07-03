import {Tile, TilePublic, Town} from './Tile'
import mapData from '../../../../public/assets/tilemaps/json/map.json'
import {iterateOnXYMap} from '../../utils/xyMapToArray'
import {MapTilesPublic} from '../types/MapTilesPublic'
import {MapTiles} from '../types/MapTiles'
import {TownByCountries} from '../types/TownByCountries'
import {TownsDataLayer} from './TownsDataLayer'

const EXPORTED_LAYER_NAMES= ["g-water", 'c-ch',       'c-it',
    'c-uk',   'c-is',    'c-gl',       'c-ie',
    'c-fr',   'c-ma',    'c-es',       'c-pt',
    'c-de',   'c-at',    'c-li',       'c-dk',
    'c-be',   'c-nl',    'c-pl',       'c-cz',
    'c-si',   'c-hr',    'c-sk',       'c-hu',
    'c-ba',   'c-me',    'c-rs',       'c-mk',
    'c-al',   'c-bg',    'c-ro',       'c-md',
    'c-ua',   'c-by',    'c-no',       'c-se',
    'c-fi',   'c-ruk',   'c-lt',       'c-lv',
    'c-ee',   'c-sval',  'c-ru',       'c-ge',
    'c-am',   'c-gr',    'c-tr',       'c-sy',
    'c-iq',   'c-ae',    'c-jo',       'c-il',
    'c-lb',   'c-eg',    'c-ly',       'c-tn',
    'c-dz', 'towns', ]

export class Map {
    private tiles: MapTiles = {}
    private townByCountries: TownByCountries = {}
    private mapWidth: number
    private mapHeight: number

    constructor() {
        this.mapWidth = mapData.width
        this.mapHeight = mapData.height

        for (let x = 0; x < this.mapWidth; x++) {
            this.tiles[x] = {}
            for (let y = 0; y < this.mapHeight; y++) {
                this.tiles[x][y] = new Tile(0)
            }
        }

        const townDataLayer = new TownsDataLayer()

        mapData.layers.forEach(layer => {
            if (layer.name.startsWith("c-") || layer.name === "towns") {
                const width = layer.width || 0
                const height = layer.height || 0
                if (!layer.data) {
                    return
                }
                let layerData = null
                let iter= 0
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        layerData = layer.data[iter]
                        if (layerData !== 0) {
                            const tile = new Tile(layerData, townDataLayer.getByCoordinates(x, y))
                            this.tiles[x][y] = tile
                            if(tile.isTown){
                                if(!this.townByCountries[tile.data!.country]){
                                    this.townByCountries[tile.data!.country] = []
                                }
                                this.townByCountries[tile.data!.country].push(tile as Town)
                            }
                        }
                        iter++
                    }
                }
                return
            }
        })
    }

    getMapTiles(): MapTiles {
        return this.tiles
}

    getTowns(): Tile[] {
        const towns: Tile[] = []
        let tempTile
        for (let x = 0; x < this.mapWidth; x++) {
            for (let y = 0; y < this.mapHeight; y++) {
                tempTile = this.tiles[x][y]
                if(tempTile.isTown){
                    towns.push(tempTile)
                }
            }
        }
        return towns
    }

    export(): MapTilesPublic {
        const tiles: MapTilesPublic["tiles"] = {}

        for (let x = 0; x < this.mapWidth; x++) {
            tiles[x] = {}
            for (let y = 0; y < this.mapHeight; y++) {
                if(this.tiles[x][y].player){
                    tiles[x][y] = this.tiles[x][y].export()
                }
            }
        }

        return {
            tiles,
            layerNames: EXPORTED_LAYER_NAMES
        }
    }

    getTownsState(): TilePublic[] {
        const outputArray: TilePublic[] = []
        iterateOnXYMap<Tile>(this.tiles, (tile, x, y) => {
            if(tile.isTown){
                outputArray.push(tile.export())
            }
        })

        return outputArray
    }

    getTownsByCountries() {
        return this.townByCountries
    }
}
