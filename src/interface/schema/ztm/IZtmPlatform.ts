import mongoose, { Schema, Document } from 'mongoose';
import { IPlatform } from '../general/IPlatform';

export interface IZtmPlatform extends IPlatform {
  url: string;
  isInSipTw: boolean;
}

const ztmPlatformSchema = new Schema({
  plNumber: Number,
  direction: String,
  departures: [{ type: Schema.Types.ObjectId, ref: 'ZtmDeparture' }],
  station: { type: Schema.Types.ObjectId, ref: 'ZtmStation' },
  url: String,
});

interface ZtmPlatformModel extends IZtmPlatform, Document {}

export const ZtmPlatformModel = mongoose.model<ZtmPlatformModel>('ZtmStation', ztmPlatformSchema);
