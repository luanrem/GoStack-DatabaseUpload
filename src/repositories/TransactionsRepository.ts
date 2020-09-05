import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsRepo = getRepository(Transaction);

    const transactions = await transactionsRepo.find();

    const balance = transactions.reduce(
      (accumulator: Balance, transaction: Transaction): Balance => {
        accumulator[transaction.type] += transaction.value;
        accumulator.total +=
          transaction.type === 'income'
            ? transaction.value
            : -transaction.value;

        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    return balance;
  }
}

export default TransactionsRepository;
