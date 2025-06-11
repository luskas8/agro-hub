import { Injectable } from '@nestjs/common';
import { CreateRuralProductorDto } from './dto/create-rural-productor.dto';
import { UpdateRuralProductorDto } from './dto/update-rural-productor.dto';

@Injectable()
export class RuralProductorService {
  create(createRuralProductorDto: CreateRuralProductorDto) {
    return 'This action adds a new ruralProductor';
  }

  findAll() {
    return `This action returns all ruralProductor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ruralProductor`;
  }

  update(id: number, updateRuralProductorDto: UpdateRuralProductorDto) {
    return `This action updates a #${id} ruralProductor`;
  }

  remove(id: number) {
    return `This action removes a #${id} ruralProductor`;
  }
}
