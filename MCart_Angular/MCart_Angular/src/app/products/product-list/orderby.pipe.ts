import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../product';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
    // If compareFunction(a, b) returns less than 0, sort a to an index lower than b (i.e. a comes first).
    // If compareFunction(a, b) returns 0, leave a and b unchanged with respect to each other, but sorted with respect to all different elements. Note: the ECMAscript standard does not guarantee this behavior, thus, not all browsers (e.g. Mozilla versions dating back to at least 2003) respect this.
    // If compareFunction(a, b) returns greater than 0, sort b to an index lower than a (i.e. b comes first).
  transform(value: Product[], args: string): Product[] {
    if (args === 'popularity') {
        return value.sort((a: any, b: any) => {
            if (a.rating > b.rating) {
                return -1;
            } else if (a.rating < b.rating) {
                return 1;
            } else {
                return 0;
            }
        });
    } else if (args === 'pricelh') {
        return value.sort((a: any, b: any) => {
            if (a.price < b.price) {
                return -1;
            } else if (a.price > b.price) {
                return 1;
            } else {
                return 0;
            }
        });

    } else if (args === 'pricehl') {
        return value.sort((a: any, b: any) => {
            if (a.price > b.price) {
                return -1;
            } else if (a.price < b.price) {
                return 1;
            } else {
                return 0;
            }
        });
    }
    return value;
  }
}
