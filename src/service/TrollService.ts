import { VoiceChannelService } from "./VoiceChannelService";
import { VoiceChannel, Client } from "discord.js";
import Schedule, { Job } from 'node-schedule';
import { SoundService } from "./SoundService";

export class TrollService {

    private readonly TROLL_MODE_ALL:string = "all";
    private readonly TROLL_MODE_RANDOM:string = "random";

    private voiceChannelService:VoiceChannelService;
    private soundService:SoundService;
    private client:Client;

    private isActive:boolean = false;
    private scheduledTrollExecution:Job;

    constructor(client:Client, voiceChannelService:VoiceChannelService, soundService:SoundService){
        this.client = client;
        this.voiceChannelService = voiceChannelService;
        this.soundService = soundService;
    }

    public start(minTime:number, maxTime:number, hitChance:number, channelMode:string){
        this.isActive = true;
        console.log("Troll mode: On: "+minTime+", "+maxTime+", "+hitChance+", "+channelMode);
        this.doTroll(minTime, maxTime, hitChance, channelMode);
    };

    public stop(){
        this.isActive = false;
        this.scheduledTrollExecution.cancel();
        console.log("Troll mode: Off");
    };

    private doTroll(minTime:number, maxTime:number, hitChance:number, channelMode:string) {
        if(this.isActive) {
            if(Math.random() <= hitChance){
                console.log("Troll mode: Playing sound")
                this.voiceChannelService.playSoundInMultipleVoiceChannels(this.soundService.getRandomSound(), this.getTrollChannels(channelMode));
            }
            // Calculate next troll
            let minutes = Math.floor(Math.random()*(maxTime-minTime+1)+minTime);
            let nextDate = new Date();
            nextDate.setMinutes( nextDate.getMinutes() + minutes );
            console.log("Troll mode: Next play: " + nextDate);
            // Schedule next troll execution
            this.scheduledTrollExecution = Schedule.scheduleJob(nextDate, () => this.doTroll(minTime, maxTime, hitChance, channelMode));
        }
    }

    private getTrollChannels(channelMode:string):VoiceChannel[]{
        if(channelMode == this.TROLL_MODE_ALL){
            return this.client.channels.filter(channel => channel instanceof VoiceChannel && channel.members.size > 0).map(channel => <VoiceChannel>channel);
        }else if(channelMode == this.TROLL_MODE_RANDOM){
            let channels = this.client.channels.filter(channel => channel instanceof VoiceChannel && channel.members.size > 0);
            if(channels != null && channels.size > 0){
                return [<VoiceChannel>channels.random()];
            }
        }else{
            let channels = this.client.channels.filter(channel => channel instanceof VoiceChannel && channel.name.toLowerCase().includes(channelMode.toLowerCase()) && channel.members.size > 0);
            return channels.map(channel => <VoiceChannel>channel);
        }
        return null;
    }
}