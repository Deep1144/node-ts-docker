import MemberService from './member.service';
import { HttpError } from '../../config/error';
import memberModel, { IMembersModel } from './member.model';
import { NextFunction, Request, Response } from 'express';
import { RequestWithMeta } from '../../constants/types';
import { generateLookUp } from '../../common/lookup';

export async function findAll(req: RequestWithMeta, res: Response, next: NextFunction): Promise<void> {
  try {
    const { commonQueries, limit, page } = req.meta;
    const users: any = await memberModel.aggregate([
      generateLookUp('regions', 'regionId', '_id', 'regionId'),
      ...commonQueries.match,
      commonQueries.sort,
      commonQueries.facet,
    ]);

    res.status(200).json({
      data: users[0]?.paginatedResults ?? [],
      status: 200,
      message: 'Operation successful',
      meta: {
        totalCount: users[0]?.totalCount[0]?.count ?? 0,
        page: page,
        limit: limit,
      },
    });
  } catch (error) {
    next(new HttpError(error.message.status, error.message));
  }
}

export async function findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user: IMembersModel = await MemberService.findOne(req.params.id);

    res.status(200).json(user);
  } catch (error) {
    next(new HttpError(error.message.status, error.message));
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.body || !req.body.role) {
      throw new Error('Request body and role is required');
    }

    const user: IMembersModel = await MemberService.insert(req.body);

    res.status(201).json({
      status: 200,
      message: 'Operation successful',
      data: user,
    });
  } catch (error) {
    let code = error.message.status;
    if (error.message.includes('exists')) {
      code = 409;
    }
    next(new HttpError(code, error.message));
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user: IMembersModel = await MemberService.remove(req.params.id);

    res.status(200).json(user);
  } catch (error) {
    next(new HttpError(error.message.status, error.message));
  }
}

export async function inActivate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.params.id) {
      throw new Error('id is required in parameter');
    }
    await memberModel.findByIdAndUpdate(req.params.id, {
      isActive: false,
    });
    const user = await MemberService.findOne(req.params.id);

    res.status(200).json({
      status: 200,
      message: 'Operation successful',
      data: user,
    });
  } catch (error) {
    let code = error.message.status;
    if (error.message.includes('exists')) {
      code = 409;
    }
    next(new HttpError(code, error.message));
  }
}

export async function activate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.params.id) {
      throw new Error('id is required in parameter');
    }
    await memberModel.findByIdAndUpdate(req.params.id, {
      isActive: true,
    });
    const user = await MemberService.findOne(req.params.id);

    res.status(200).json({
      status: 200,
      message: 'Operation successful',
      data: user,
    });
  } catch (error) {
    let code = error.message.status;
    if (error.message.includes('exists')) {
      code = 409;
    }
    next(new HttpError(code, error.message));
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.body || !req.params.id) {
      throw new Error('Req body and parameter are required');
    }
    delete req.body._id;
    let member = await memberModel.findById(req.params.id);
    Object.entries(req.body).forEach((e) => {
      member[e['0']] = e['1'];
    });
    await member.save();

    // await memberModel.findOneAndUpdate({_id : req.params.id}, req.body);
    const user = await MemberService.findOne(req.params.id);

    res.status(200).json({
      status: 200,
      message: 'Operation successful',
      data: user,
    });
  } catch (error) {
    let code = error.message.status;
    if (error.message.includes('exists')) {
      code = 409;
    }
    next(new HttpError(code, error.message));
  }
}
