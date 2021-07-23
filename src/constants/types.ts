import { Pagination } from '../common/pagination.helper';
import { Request } from 'express';
import { IMembersModel } from '../components/member/member.model';

export type RequestWithMeta = Request & { meta: Pagination.MetaInfo; user: IMembersModel };
