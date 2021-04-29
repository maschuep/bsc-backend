import { Router } from 'express';
import { ControllersObject } from './controllers-object.interface';

export interface ControllerFactory {
    getPathAndRouter(): ControllersObject;
}
