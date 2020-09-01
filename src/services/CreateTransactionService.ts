// import AppError from '../errors/AppError';

import { getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category: categoryName,
  }: TransactionDTO): Promise<Transaction> {
    /**
     *  Regras de negocio:
     *  [X] Verificar se existe esta categoria
     *  [X] Se nao existir criar uma nova e armazenar no banco de dados
     *  [X] Se existir relacionar a transacao e armazenar a transacao no banco de dados
     *  [X] Retornar uma transacao
     */

    const categoryRepository = getRepository(Category);
    const transactionRepository = getRepository(Transaction);

    const checkCategoryExists = await categoryRepository.findOne({
      where: { title: categoryName },
    });

    if (!checkCategoryExists) {
      const category = categoryRepository.create({
        title: categoryName,
      });

      await categoryRepository.save(category);
    }

    const categoryArray = await categoryRepository.find({
      where: { title: categoryName },
    });

    const transaction = transactionRepository.create({
      title,
      type,
      value,
      category_id: categoryArray[0].id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
