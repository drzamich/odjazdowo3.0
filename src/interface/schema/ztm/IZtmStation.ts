import mongoose, { Schema, Document } from 'mongoose';
import { IStation } from '../general/IStation';
import { IZtmPlatform } from './IZtmPlatform';

export interface IZtmStation extends IStation {
  ztmId: string;
  url: string;
  platforms: IZtmPlatform[];
}

const ztmStationSchema = new Schema({
  name: String,
  ztmId: String,
  url: String,
  platforms: [{
    plNumber: String,
    direction: String,
    url: String,
    isInSipTw: Boolean,
  }],
});

interface ZtmStationModel extends IZtmStation, Document {}

export const ZtmStationModel = mongoose.model<ZtmStationModel>('ZtmStation', ztmStationSchema);
