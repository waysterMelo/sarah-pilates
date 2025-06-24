import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

interface CustomError extends Error {
  statusCode?: number;
}

const errorMiddleware = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Erro interno do servidor';

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        statusCode = 409;
        message = 'Registro já existe';
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Registro não encontrado';
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Violação de chave estrangeira';
        break;
      default:
        statusCode = 400;
        message = 'Erro de banco de dados';
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Dados inválidos';
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error);
  }

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      details: error
    })
  });
};

export default errorMiddleware;