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
        const keyArray = [];
        const arrayOfObj = [];
        for (let item in obj) {
            keyArray.push(item);
            arrayOfObj.push(obj[item]);
            setTimeout(() => {
                console.debug(arrayOfObj);
                resolve(arrayOfObj);
            }, 500);
        }
    })
};

export const randomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min)) + min;
};

export const reduceToSum = (
    accumulator: number,
    currentValue: number
): number => {
    return accumulator + currentValue;
};

export function runOnce(data)  {
    if (!this.hasRun) {
        data();
        this.hasRun = true;
    }
}

export const reduceArrayToPercent = (array1: [] = [], array2: [] = []) => {
    const total1 = array1.length || 0;
    const total2 = array2.length || 0;
    const total = total1 + total2;
    const array1Percent = total1 / total * 100;
    const array2Percent = total2 / total * 100;
    return {count: total, array1Percent, array2Percent}
};


// Warn if overriding existing method
export const isArrayEquals = (arrayOne: [] = [], ArrayTwo: [] = []) => {
    return JSON.stringify(arrayOne) === JSON.stringify(ArrayTwo)
};