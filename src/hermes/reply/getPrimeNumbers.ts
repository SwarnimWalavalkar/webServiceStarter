import z from "zod";
import hermes from "..";
import { IService } from "@swarnim/hermes";

const inputSchema = z.object({ max: z.number() });
const outputSchema = z.object({ numbers: z.array(z.number()) });

export let primeNumberService: IService<
  z.infer<typeof inputSchema>,
  z.infer<typeof outputSchema>
>;

hermes
  .registerService("get-prime-numbers", inputSchema, outputSchema)
  .then((s) => (primeNumberService = s));

export function registerGetPrimeNumbersReply() {
  primeNumberService.reply(({ reqData }) => {
    const { max } = reqData;

    const isPrime = (maxNum: number) => {
      if (maxNum <= 1) return false;
      if (maxNum <= 3) return true;
      if (maxNum % 2 === 0 || maxNum % 3 === 0) return false;

      for (let i = 5; i * i <= maxNum; i += 6) {
        if (maxNum % i === 0 || maxNum % (i + 2) === 0) return false;
      }

      return true;
    };

    const primes = [];
    for (let i = 2; i <= max; i++) {
      if (isPrime(i)) {
        primes.push(i);
      }
    }

    return { numbers: primes };
  });
}
