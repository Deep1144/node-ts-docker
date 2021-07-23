import { Response, NextFunction, Request } from 'express';
import { Types } from 'mongoose';
import { Pagination } from '../../common/pagination.helper';
import { RequestWithMeta } from '../../constants/types';

export default async function (req: RequestWithMeta, res: Response, next: NextFunction) {
  try {
    let { page, limit, order, sort, filters }: any = req.query;
    const meta: Pagination.MetaInfo = new Pagination.MetaInfo(page, limit, sort, order);
    meta.filters = handleFilters(filters ? JSON.parse(filters) : {});
    meta.commonQueries.match = matchQuery(meta.filters);
    meta.commonQueries = { ...meta.commonQueries, ...getCommonQuery(meta) };
    req['meta'] = meta;
    next();
  } catch (error) {
    console.error('middleware -> pagination : ', error);
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
}

const handleFilters = (filters: Record<string, any>) => {
  if (!filters || !Object.keys(filters).length) {
    return [];
  }
  const reduced = Object.keys(filters).reduce((prev: any, curr) => {
    prev.push({
      field: curr,
      value: filters[curr],
    });
    return prev;
  }, []);
  return reduced;
};

const matchQuery = (filters: Array<{ field: string; value: any }>) => {
  const matchAggregate = [];

  if (filters.length) {
    filters.forEach((filter) => {
      if (filter.value) {
        // convert to objectId
        if (shouldConvertToObjectId(filter.field, filter.value)) {
          filter.value = Types.ObjectId(filter.value);
        }

        // Check if number is comparing b\w num and string
        let strObj;
        if (typeof filter.value === 'number') {
          strObj = {
            $addFields: {
              [filter.field + '_str']: { $toString: `\$${filter.field}` },
            },
          };
          matchAggregate.push(strObj);
        }

        matchAggregate.push({
          $match: {
            [strObj ? filter.field + '_str' : filter.field]: filter.field.toLowerCase().includes('date')
              ? new Date(filter.value)
              : shouldIgnoreRegex(filter.field, filter.value)
              ? filter.value
              : new RegExp(filter.value, 'i'),
          },
        });
      }
    });
  }

  return matchAggregate;
};

export const shouldConvertToObjectId = (field: string, value = ''): boolean => {
  // const fieldToConvertToObjectId = ['userId', 'memberId', 'jobcardId', 'bookingId'];
  if (field === '_id' || field.includes('_id') || (field.includes('Id') && !field.includes('.'))) {
    return true;
  }
  if (Types.ObjectId.isValid(value)) {
    return true;
  }
  return false;
};

export const shouldIgnoreRegex = (field: string, value = ''): boolean => {
  const ignoreRegexForFields = ['role', 'memberId.role', 'userId.role', '_id'];
  const idParamIgnore = ['_id', 'bookingId', 'memberId', 'userId'];
  let shouldIgnore = false;
  if (ignoreRegexForFields.includes(field) || Types.ObjectId.isValid(value)) {
    shouldIgnore = true;
  }

  idParamIgnore.some((e) => {
    if (field.includes(e)) {
      shouldIgnore = true;
      return true;
    }
  });
  // console.log({ shouldIgnore });
  return shouldIgnore;
};

const getCommonQuery = (meta: Pagination.MetaInfo) => {
  const sort = { $sort: { [meta.sort]: meta.order } };
  const facet = {
    $facet: {
      paginatedResults: [{ $skip: meta.skip }, { $limit: meta.limit }],
      totalCount: [
        {
          $count: 'count',
        },
      ],
    },
  };
  return { sort, facet };
};
