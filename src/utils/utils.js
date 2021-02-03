export const makeCleanClassName = (classNames:string[]): string => {
    const CLASSES_SEPARATOR = ' ';
    // Filter with "Boolean" deleting empty values
    return classNames.filter(Boolean).join(CLASSES_SEPARATOR);
};
export const uppercaseFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1, str.length);
};
export const objectToArray = (obj:Object) => {
    const keyArray = [];
    const arrayOfObj = [];
    for (let item in obj) {
        keyArray.push(item);
    }
    for (let item of keyArray) {
        arrayOfObj.push(obj[item]);
    }
    return arrayOfObj;
};

export const randomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min)) + min;
};