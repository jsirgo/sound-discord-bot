import { GuildMember, TextChannel, Message, DMChannel, NewsChannel } from "discord.js";

export class AddSoundProcessData {

    private step:number;
    private user:GuildMember;
    private channel:TextChannel | DMChannel | NewsChannel;
    private fileUrl:string;
    private text:string;
    private tags:string;

    constructor(){
        this.step = 0;
        this.user = null;
        this.channel = null;
        this.fileUrl = null;
        this.text = null;
        this.tags = null;
    }

    public setUser(user:GuildMember): void{
        this.user = user;
    }

    public setChannel(channel:TextChannel | DMChannel | NewsChannel): void{
        this.channel = channel;
    }

    public setFileUrl(fileUrl:string): void{
        this.fileUrl = fileUrl;
    }

    public setText(text:string): void{
        this.text = text;
    }

    public setTags(tags:string): void{
        this.tags = tags;
    }

    public getFileUrl():string {
        return this.fileUrl;
    }

    public getText():string {
        return this.text;
    }

    public getTags():string {
        return this.tags;
    }

    public getStep():number {
        return this.step;
    }

    public increaseStep(): void{
        this.step++;
    }

    public validateUserAndChannel(message:Message):boolean {
        return this.user != null && this.channel != null && this.user.id == message.member.id && this.channel.id == message.channel.id;
    }

    public isAddProcessRunning():boolean {
        return this.step > 0;
    }

}