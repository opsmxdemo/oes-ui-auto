import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'nonAdmins'
})
export class NonAdminPipe implements PipeTransform {
    transform(users: Array<any>, type: string): Array<any> {
        return users.filter(user => user.admin === false);
    }
}


    // transform(users: Array<any>, type: string): Array<any> {
    //     return users.filter(user => user.admin === false);
    // }
    //  transform(users: Array<any>, type: string): Array<any> {
    //     return users.filter(user => user.admin === false);
    // }