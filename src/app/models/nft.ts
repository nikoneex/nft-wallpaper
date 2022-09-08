export interface INft {
    balance: string
    contract: {}
    contractMetadata: { 
        name: string, 
        symbol: string, 
        totalSupply: string, 
        tokenType: string 
    }
    description: string
    error: string
    id: { 
        tokenId: string, 
        tokenMetadata: {}
    }
    media: IMediaModel[]
    metadata: {}
    timeLastUpdated: string
    title: string
    tokenUri: {}
    image_url: string
}

export interface IMediaModel {
    bytes: number
    format: string
    gateway: string
    raw: string
    thumbnail: string
}

export interface ICollectionModel {
    contracts: string[]
    id: string
    logo: string
    name: string
    verified: boolean
}