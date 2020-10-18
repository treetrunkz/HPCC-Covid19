const axios = require("axios");
const endpoint = ('https://api.coronavirus.data.gov.uk/v1/data?' +
    'filters=areaType=region;areaName=london&' +
    'structure={"date":"date","name":"areaName","code":"areaCode","deaths":"cumDeathsByDeathDate"}');
const getData = async (url: any) => {
    const { data, status, statusText } = await axios.get(url, { timeout: 10000 });
    if (status >= 400)
        throw new Error(statusText);
    return data;
}; // getData
const main = async () => {
    const result = await getData(endpoint);
    console.log(result);
}; // main
main().catch(err => {
    console.error(err);
    process.exitCode = 1;
});
export {};