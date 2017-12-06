import { FormGroup } from '@angular/forms';

export class FXEmployee {
    UserID: number;
    EmployeeID: string;
    EmployeeName: string;
    Email: string;
    Position: string;
    Department: string;
    Status: string;
    LastActivity: Date;
    Superior: any;
    NewPassword: string;
    ActiveStart: Date;
    ActiveEnd: Date;
}
