
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string;  // Or use a different type if necessary
    }
  }
}
