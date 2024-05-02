import { v4 as uuid } from 'uuid';

export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) return callback(new Error('No se encontro ningun archivo'), false);

  const fileExtension = file.mimetype.split('/')[1];
  const fileNamer = `${uuid()}.${fileExtension}`;

  callback(null, fileNamer);
};
