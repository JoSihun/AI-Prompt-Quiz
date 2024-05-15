interface Channel {
    id: string,
    code: string,
    name: string,
    curPlayers: number,
    maxPlayers: number
}
interface ChannelChat {
    userId:bigint,
    nickname: string,
    uuid: string,
    content: string,
}

interface RecieveChannelChat {
    nickname: string,
    uuid: string,
    content: string,
    createdDate: string,    
}