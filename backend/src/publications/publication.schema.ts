
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PublicationDocument = HydratedDocument<Publication>;

@Schema({ timestamps: true })
export class Publication {

  @Prop({ required: true, trim: true })
  titulo: string;

  @Prop({ required: true, trim: true })
  descripcion: string;

  @Prop({ type: String, default: null })
imagen: string | null;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true
  })
  autor: Types.ObjectId;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    default: []
  })
  likes: Types.ObjectId[];

  @Prop({ default: true })
  activa: boolean;
}

export const PublicationSchema =
  SchemaFactory.createForClass(Publication);
