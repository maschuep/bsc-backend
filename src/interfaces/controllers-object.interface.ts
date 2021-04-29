import { Router } from 'express';

export interface ControllersObject {
    path: string;
    controller: Router;
}
