import { Request, Response } from "express";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import SearchService from "../services/search.service";

class SearchController{
    searchService: SearchService

    constructor(){
        this.searchService = new SearchService()
    }

    async searchAll(req:Request,res:Response){
        const description = String(req.query.ds)
        const filter = String(req.query.filter)
        
        let responseArtist = null
        let responseSong = null
        let responsePlaylist = null
        try{
            responseArtist = await this.searchService.searchArtist(description,filter)
            responseSong = await this.searchService.searchSong(description,filter)
            responsePlaylist = await this.searchService.searchPlaylist(description,filter)
        }catch(error){
            const message = error instanceof Error ? error.message : "ERRO"
            return res.status(400).json(message)
        }

        // let responseArtistList = []
        // let responseSongList = []
        // let responsePlaylistList = []
        // for(var val of responseArtist){
        //     responseArtistList.push({name:val.name,id:val.login,type:"artist"})
        // }
        // for(var val2 of responseSong){
        //     responseSongList.push({name:val2.name,id:val2.songID,type:"song"})
        // }
        // for(var val3 of responsePlaylist){
        //     responsePlaylistList.push({name:val3.name,id:val3.playlistID,type:"playlist"})
        // }

        let {responseArtistList, responseSongList, responsePlaylistList} = this.addTypeField(responseArtist,responseSong,responsePlaylist)

        return res.status(200).json([...responseArtistList,...responseSongList,...responsePlaylistList])
    }

    addTypeField(responseArtist: any,responseSong: any,responsePlaylist: any){
        
        let responseArtistList = []
        let responseSongList = []
        let responsePlaylistList = []
        for(var val of responseArtist){
            responseArtistList.push({name:val.name,id:val.login,type:"artist"})
        }
        for(var val2 of responseSong){
            responseSongList.push({name:val2.name,id:val2.songID,type:"song"})
        }
        for(var val3 of responsePlaylist){
            responsePlaylistList.push({name:val3.name,id:val3.playlistID,type:"playlist"})
        }
        return {responseArtistList,responseSongList, responsePlaylistList};
    }
}
export default SearchController