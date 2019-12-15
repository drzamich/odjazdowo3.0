import mongoose, { Schema, Document } from 'mongoose';
import { IStation } from '../general/IStation';

export interface IZtmStation extends IStation {
  ztmId: string;
  url: string;
}

const ztmStationSchema = new Schema({
  ztmId: String,
  name: String,
  // platforms: [{ type: Schema.Types.ObjectId, ref: 'ZtmPlatform' }],
  url: String,
});

interface ZtmStationModel extends IZtmStation, Document {}

export const ZtmStationModel = mongoose.model<ZtmStationModel>('ZtmStation', ztmStationSchema);
