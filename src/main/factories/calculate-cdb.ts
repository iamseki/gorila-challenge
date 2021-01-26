import { Controller } from '@/presentation/protocols/controller';
import { DBCalculateUnitCDB } from '../../app/usecases/db-calculate-unit-cdb';
import { MemoizationCacheRepository } from '../../infra/db/cache/memoization/computed-cdb-repository';
import { CDIMongoRepository } from '../../infra/db/mongodb/cdi-repository';
import { CalculateCDBController } from '../../presentation/controllers/calculate-cdb';
import { DateValidatorAdapter } from '../../util/date-validator-adapter';

export const makeCalculateCDBController = (): Controller => {
  const dateValidator = new DateValidatorAdapter();
  const cdiMongoRepository = new CDIMongoRepository();
  const cdiMemoizationCacheRepository = new MemoizationCacheRepository();
  const dbCalculateUnitCDB = new DBCalculateUnitCDB(
    cdiMongoRepository,
    cdiMemoizationCacheRepository
  );
  return new CalculateCDBController(dbCalculateUnitCDB, dateValidator);
};
