
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PublicationDocument = HydratedDocument<Publication>;

@Schema()
export class Comentario {

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true
  })
  autor: Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 500 })
  texto: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ComentarioSchema =
  SchemaFactory.createForClass(Comentario);

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

  @Prop({
    type: [ComentarioSchema],
    default: []
  })
  comentarios: Comentario[];

  @Prop({ default: true })
  activa: boolean;
}

export const PublicationSchema =
  SchemaFactory.createForClass(Publication);
