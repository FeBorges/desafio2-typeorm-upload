import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

// Repositório nossa interface de conexção do banco de dados

// para instanciar o repositório
import TransactionsRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    // TODO > funcionalidade de adicionar ao banco de dados estas informações
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    // senão tiver um balance suficiente
    const { total } = await transactionsRepository.getBalance();
    if (type === 'outcome' && total < value) {
      throw new AppError('Você não possui saldo suficiente');
    }

    // Verificar se a categoria já existe
    let transactionCategory = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });
    // Ela não existe? criar
    if (!transactionCategory) {
      transactionCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(transactionCategory);
    }

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category: transactionCategory,
    });
    // salvar no banco
    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
