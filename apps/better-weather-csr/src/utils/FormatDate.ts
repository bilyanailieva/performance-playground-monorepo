export const momentDateToString = (date: moment.Moment) => {
    return date.format("YYYY-MM-DD");
}

export const momentDateToDateTimeString = (date: moment.Moment) => {
    return date.format('lll');
}

export const intervalToDateFormat = (interval: 'hourly' | 'daily' | 'monthly') => {
    switch(interval) {
        case 'hourly':
            return 'lll';
        case 'daily':
            return 'DD-MM-YYYY';
        case 'monthly':
            return 'MM-YYYY';
        default: 
            return 'DD-MM-YYYY';
    }
}