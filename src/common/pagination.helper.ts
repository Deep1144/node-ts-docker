import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../constants/constant';
export namespace Pagination {
  export enum OrderType {
    ACS = 'acs',
    DESC = 'desc',
  }

  type CommonQueries = {
    match: any;
    sort: any;
    facet: any;
  };

  export class MetaInfo {
    page: number;
    limit: number;
    order?: number;
    sort?: string = '';
    skip: number;
    filters? = [];
    commonQueries: Partial<CommonQueries> = {};
    // matchQuery?: Array<any> = [];

    constructor(page: any, limit: any, sort = '', order: string) {
      if (!page || page <= 0) {
        page = DEFAULT_PAGE;
      }
      if (!limit || limit <= 0) {
        limit = DEFAULT_LIMIT;
      }
      this.page = parseInt(page);
      this.limit = parseInt(limit);
      this.sort = sort || 'createdAt';

      if (!order && (!sort || sort === 'createdAt')) {
        order = OrderType.DESC;
      } else if (!order && sort && sort !== 'createdAt') {
        order = OrderType.ACS;
      }

      if (order === OrderType.ACS) {
        this.order = 1;
      } else if (order === OrderType.DESC) {
        this.order = -1;
      }

      this.skip = this.limit * (this.page - 1);
    }
  }
}
