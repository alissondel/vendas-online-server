import { cityEntityMock } from "../../cities/__mock__/city.mock";
import { CreateAddressDto } from "../dto/create-address.dto";
import { addressEntityMock } from "./address.mock";

export const createAddressMock: CreateAddressDto = {
  complement: addressEntityMock.complement,
  numberAddress: addressEntityMock.numberAddress,
  cep: addressEntityMock.cep,
  cityId: cityEntityMock.id,
}