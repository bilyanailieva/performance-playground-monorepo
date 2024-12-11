export const momentDateToString = (date: moment.Moment) => {
    return date.format("YYYY-MM-DD");
}

export const momentDateToDateTimeString = (date: moment.Moment) => {
    return date.format('lll');
}