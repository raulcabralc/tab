import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { WorkerRole } from "./types/enums/role.enum";

@Schema({ timestamps: true })
export class Worker {
  // Nome completo do funcionário
  @Prop({ required: true })
  fullName: string;

  // Nome de exibição do funcionário
  @Prop({ required: true })
  displayName: string;

  // Função do funcionário
  @Prop({ required: true })
  role: WorkerRole;

  // Email do funcionário
  @Prop({ required: true, unique: true })
  email: string;

  // Senha do funcionário (criptografada)
  @Prop({ required: true })
  pinHash: string;

  // Se o funcionário está contratado
  @Prop({ default: true })
  isActive: boolean;

  // Data de contratação do funcionário
  @Prop({ required: true })
  hireDate: string;
}

export const WorkerSchema = SchemaFactory.createForClass(Worker);
