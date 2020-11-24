import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

import TransactionRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    // TODO
    // validação se ele existe no banco se sim apaga senão retorna erro
    const transactionsRepository = getCustomRepository(TransactionRepository);

    // buscar se ela existe
    const transaction = await transactionsRepository.findOne(id);

    if (!transaction) {
      throw new AppError('Transação não encontrada');
    }

    // se existe e não precisa retornar nada pode colocar direto:
    await transactionsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
