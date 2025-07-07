"use server";

import { aiService } from "../ai";
import { extractJSON } from "../utils";

export const findCar = async (car: string) => {};

export const autoGenerateCar = async (carName: string) => {
  const response = await aiService.generateCarAgent(carName);

  const parsed = extractJSON(response);

  //   console.log("response", response);
  //   console.log("parsed", parsed);

  return parsed;
};
