import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
  total: number;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category: categoryName,
    total,
  }: TransactionDTO): Promise<Transaction> {
    /**
     *  Regras de negocio:
     *  [X] Verificar se existe esta categoria
     *  [X] Se nao existir criar uma nova e armazenar no banco de dados
     *  [X] Se existir relacionar a transacao e armazenar a transacao no banco de dados
     *  [X] Retornar uma transacao
     */

    if (type === 'outcome' && value > total) {
      throw new AppError('You dont have enough money');
    }

    const categoryRepository = getRepository(Category);
    const transactionRepository = getRepository(Transaction);

    let existedCategory = await categoryRepository.findOne({
      where: { title: categoryName },
    });

    if (!existedCategory) {
      existedCategory = categoryRepository.create({
        title: categoryName,
      });

      await categoryRepository.save(existedCategory);
    }

    const transaction = transactionRepository.create({
      title,
      type,
      value,
      category: existedCategory,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
