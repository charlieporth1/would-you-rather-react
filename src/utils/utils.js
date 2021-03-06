export const makeCleanClassName = (classNames: string[]): string => {
    const CLASSES_SEPARATOR = ' ';
    // Filter with "Boolean" deleting empty values
    return classNames.filter(Boolean).join(CLASSES_SEPARATOR);
};
export const uppercaseFirstLetter = (str: string = 'charles') => {
    return str.charAt(0).toUpperCase() + str.slice(1, str.length);
};
export const objectToArray = async (obj: Object) => {
    return new Promise(resolve => {
        const arrayOfObj = [];
        for (let item in obj) {
            arrayOfObj.push(obj[item]);
            setTimeout(() => resolve(arrayOfObj.filter(onlyUnique)), 100);
        }
    })
};
export const objectToArrayNonAsync = (obj: Object) => {
    const arrayOfObj = [];
    for (let item in obj) {
        arrayOfObj.push(obj[item]);
        if (Object.keys(obj).pop() === item) {
            return arrayOfObj;
        }
    }
};
export const onlyUnique = (value: any, index: number, self: any[]): boolean => {
    return self.indexOf(value) === index;
};
export const onlyUniqueAndNil = (value: any, index: number, self: any[]): boolean => {
    return !!value && self.indexOf(value) === index;
};
export const filterNil = (value: any): boolean => {
    return !!value;
};

export const reduceToBoolean = (
    accumulator: boolean,
    currentValue: boolean
): boolean => {
    return true === (accumulator === currentValue);
};
// Simple sort array function
// used as array.sort(simpleSort)
export const simpleSort = (a: any, b: any): number => {
    const simpleCompare = (alpha: any | any, bravo: any) => {
        if (alpha > bravo) {
            return 1;
        } else if (alpha < bravo) {
            return -1;
        } else {
            return 0;
        }
    };
    if (typeof a === 'number' && typeof b === 'number') {
        return a - b;
    } else if (typeof a === 'string' && typeof b === 'string') {
        return a.localeCompare(b);
    } else if (typeof a === 'object' && typeof b === 'object') {
        return simpleCompare(a, b);
    } else {
        return simpleCompare(a, b);
    }
};
export const timeStampSort = (a, b) => {
    return a.timestamp - b.timestamp;
};
export const timeStampSortDescending = (
    a,
    b
): number => {
    return timeStampSort(b, a);
};
// Alias function
export const simpleSortAscending = (
    a: any,
    b: any
): number => {
    return simpleSort(a, b);
};
// reverse function
export const simpleSortDescending = (
    a: any,
    b: any
): number => {
    return simpleSort(b, a);
};

export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export const randomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min)) + min;
};

export const reduceToSum = (
    accumulator: number,
    currentValue: number
): number => {
    return accumulator + currentValue;
};

export const runOnce = (data, windowVar: string = 'hasRun', reRun: boolean = false) => {
    if (!window[windowVar]) {
        window[windowVar] = true;
        data();
        if (windowVar === 'hasRun' || reRun) {
            setTimeout(() => window[windowVar] = false, 8000)
        }
    }
};

export const reduceArrayToPercent = (array1: [] = [], array2: [] = []) => {
    const total1 = array1.length || 0;
    const total2 = array2.length || 0;
    const total = total1 + total2 || 0;
    const array1Percent = total1 / total * 100 || 0;
    const array2Percent = total2 / total * 100 || 0;
    return {count: total, array1Percent, array2Percent}
};


// Warn if overriding existing method
export const isArrayEquals = (arrayOne: [] = [], ArrayTwo: [] = []) => {
    return JSON.stringify(arrayOne) === JSON.stringify(ArrayTwo)
};
export const combineArrays = async (...arrays: []) => [].concat(...arrays).filter(onlyUniqueAndNil);
// return new Promise((resolve) => {
//     const combine = [].concat(...arrays).filter(onlyUniqueAndNil);
//     setTimeout(() => resolve(combine), 250);
// });
// };