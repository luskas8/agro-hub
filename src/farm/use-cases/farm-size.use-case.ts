import { CreateFarmDto } from '../dto/create-farm.dto';

export class FarmSizeUseCase {
  execute(input: CreateFarmDto): boolean {
    const usedSize = input.vegetableAreaInHectares + input.arableAreaInHectares;
    if (usedSize > input.totalAreaInHectares) {
      return false;
    }

    return true;
  }
}
